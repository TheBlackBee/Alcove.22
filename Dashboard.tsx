import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import ActivityItem from '@/components/dashboard/ActivityItem';
import LanguageDistribution from '@/components/dashboard/LanguageDistribution';
import ResponseTemplateCard from '@/components/dashboard/ResponseTemplateCard';
import { NewResponseDialog } from '@/components/dialog/NewResponseDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Activity, ResponseTemplate, Stats, LanguageStat } from '@/types';

export default function Dashboard() {
  const { t } = useTranslation();
  const [showNewResponseDialog, setShowNewResponseDialog] = useState(false);

  // Fetch stats
  const { data: stats, isLoading: isLoadingStats } = useQuery<Stats>({
    queryKey: ['/api/stats'],
  });

  // Fetch recent activity
  const { data: activities, isLoading: isLoadingActivities } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  // Fetch language distribution
  const { data: languageStats, isLoading: isLoadingLanguageStats } = useQuery<LanguageStat[]>({
    queryKey: ['/api/languages/stats'],
  });

  // Fetch templates
  const { data: templates, isLoading: isLoadingTemplates } = useQuery<ResponseTemplate[]>({
    queryKey: ['/api/templates'],
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-400">{t('dashboard')}</h2>
        <p className="text-neutral-300">{t('overview')}</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoadingStats ? (
          // Show loading skeletons for stats
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
              <div className="h-10 bg-neutral-200 rounded mb-2"></div>
              <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
            </div>
          ))
        ) : stats ? (
          <>
            <StatsCard 
              icon="envelope" 
              iconColor="primary" 
              title={t('totalResponses')} 
              value={stats.totalResponses.toString()} 
              trend={stats.responseTrend} 
              trendText={`${stats.responseTrend}% ${t('fromLastMonth')}`} 
            />
            
            <StatsCard 
              icon="clock" 
              iconColor="accent" 
              title={t('responseTime')} 
              value={stats.avgResponseTime} 
              trend={-stats.responseTimeTrend} 
              trendText={`${stats.responseTimeTrend}% ${t('fasterThanTarget')}`} 
            />
            
            <StatsCard 
              icon="thumbs-up" 
              iconColor="success" 
              title={t('clientSatisfaction')} 
              value={`${stats.satisfaction}%`} 
              trend={stats.satisfactionTrend} 
              trendText={`${stats.satisfactionTrend}% ${t('fromLastMonth')}`} 
            />
            
            <StatsCard 
              icon="language" 
              iconColor="warning" 
              title={t('languagesUsed')} 
              value={stats.languagesUsed.toString()} 
              trendText={stats.languagesList.join(', ')} 
              hideTrendIcon
            />
          </>
        ) : null}
      </div>
      
      {/* Recent Activity and Language Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow lg:col-span-2">
          <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h3 className="font-medium">{t('recentActivity')}</h3>
            <button className="text-primary text-sm hover:underline">{t('viewAll')}</button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {isLoadingActivities ? (
                // Show loading skeletons for activities
                [...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-neutral-200"></div>
                    <div className="ml-3 w-full">
                      <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : activities && activities.length > 0 ? (
                activities.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <p className="text-center text-neutral-300 py-4">{t('noRecentActivity')}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Language Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-neutral-200">
            <h3 className="font-medium">{t('languageDistribution')}</h3>
          </div>
          <div className="p-6 flex flex-col items-center justify-center">
            {isLoadingLanguageStats ? (
              <div className="w-32 h-32 rounded-full border-8 border-neutral-200 animate-pulse"></div>
            ) : languageStats ? (
              <LanguageDistribution data={languageStats} />
            ) : null}
          </div>
        </div>
      </div>
      
      {/* Response Templates */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{t('responseTemplates')}</h3>
          <Button
            variant="ghost"
            className="text-primary text-sm hover:bg-transparent hover:underline flex items-center p-0"
            onClick={() => setShowNewResponseDialog(true)}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            {t('addTemplate')}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoadingTemplates ? (
            // Show loading skeletons for templates
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                <div className="p-4 border-b border-neutral-200">
                  <div className="h-5 bg-neutral-200 rounded w-1/2"></div>
                </div>
                <div className="p-4">
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                    <div className="flex space-x-2">
                      <div className="h-8 bg-neutral-200 rounded w-16"></div>
                      <div className="h-8 bg-neutral-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : templates && templates.length > 0 ? (
            templates.map(template => (
              <ResponseTemplateCard key={template.id} template={template} />
            ))
          ) : (
            <div className="col-span-full text-center text-neutral-300 py-8">
              <p>{t('noTemplatesFound')}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowNewResponseDialog(true)}
              >
                {t('createFirstTemplate')}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <NewResponseDialog 
        open={showNewResponseDialog} 
        onOpenChange={setShowNewResponseDialog} 
      />
    </div>
  );
}
