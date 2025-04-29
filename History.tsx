import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { SearchIcon, Clock, CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from '@/types';
import { format } from 'date-fns';

export default function History() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Fetch activities with more historical data
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities/history'],
  });

  // Filter activities based on search and period
  const filteredActivities = activities?.filter(activity => {
    // Search filter
    const matchesSearch = 
      searchQuery === '' || 
      activity.templateTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (activity.recipient && activity.recipient.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Period filter
    if (filterPeriod === 'all') return matchesSearch;
    
    const activityDate = new Date(activity.timestamp);
    const now = new Date();
    
    switch (filterPeriod) {
      case 'today':
        return matchesSearch && 
          activityDate.getDate() === now.getDate() &&
          activityDate.getMonth() === now.getMonth() &&
          activityDate.getFullYear() === now.getFullYear();
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return matchesSearch && activityDate >= weekAgo;
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return matchesSearch && activityDate >= monthAgo;
      default:
        return matchesSearch;
    }
  });

  // Group activities by date
  const groupedActivities: Record<string, Activity[]> = {};
  
  filteredActivities?.forEach(activity => {
    const date = new Date(activity.timestamp);
    const dateKey = format(date, 'yyyy-MM-dd');
    
    if (!groupedActivities[dateKey]) {
      groupedActivities[dateKey] = [];
    }
    
    groupedActivities[dateKey].push(activity);
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-400">{t('history')}</h2>
        <p className="text-neutral-300">{t('viewPastActivities')}</p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300 h-4 w-4" />
          <Input
            type="text"
            placeholder={t('searchHistory')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select
          value={filterPeriod}
          onValueChange={setFilterPeriod}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t('timePeriod')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allTime')}</SelectItem>
            <SelectItem value="today">{t('today')}</SelectItem>
            <SelectItem value="week">{t('pastWeek')}</SelectItem>
            <SelectItem value="month">{t('pastMonth')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Activity History */}
      {isLoading ? (
        // Loading state
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-neutral-200 rounded w-48 mb-2"></div>
              <Card className="mb-4">
                <CardContent className="p-0">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="border-b border-neutral-200 p-4 flex">
                      <div className="h-10 w-10 bg-neutral-200 rounded-full mr-4"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-neutral-200 rounded mb-2 w-3/4"></div>
                        <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : Object.keys(groupedActivities).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedActivities)
            .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
            .map(([dateKey, dayActivities]) => (
              <div key={dateKey}>
                <h3 className="font-medium text-neutral-400 mb-2 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {format(new Date(dateKey), 'MMMM d, yyyy')}
                </h3>
                
                <Card>
                  <CardContent className="p-0">
                    {dayActivities.map((activity) => {
                      // Determine icon and color based on activity type
                      let iconColor = 'text-primary';
                      let bgColor = 'bg-primary bg-opacity-10';
                      let icon = 'reply';
                      
                      if (activity.type === 'create') {
                        iconColor = 'text-success';
                        bgColor = 'bg-success bg-opacity-10';
                        icon = 'plus';
                      } else if (activity.type === 'edit') {
                        iconColor = 'text-warning';
                        bgColor = 'bg-warning bg-opacity-10';
                        icon = 'edit';
                      }
                      
                      return (
                        <div 
                          key={activity.id}
                          className="border-b last:border-b-0 border-neutral-200 p-4 flex items-start"
                        >
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full ${bgColor} flex items-center justify-center mr-3`}>
                            <i className={`fas fa-${icon} ${iconColor} text-sm`}></i>
                          </div>
                          
                          <div className="flex-1">
                            <p className="text-sm mb-1">
                              <span className="font-medium text-neutral-400">
                                {activity.templateTitle}
                              </span>
                              {' '}
                              {activity.type === 'send' && (
                                <>
                                  {t('responseSent')}{' '}
                                  <span className="font-medium text-neutral-400">
                                    {activity.recipient}
                                  </span>
                                </>
                              )}
                              {activity.type === 'create' && t('templateCreated')}
                              {activity.type === 'edit' && t('templateEdited')}
                            </p>
                            
                            <div className="flex items-center text-xs text-neutral-300">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(new Date(activity.timestamp), 'h:mm a')}
                              
                              <span className="mx-2">•</span>
                              
                              <Badge variant="outline" className="text-xs font-normal">
                                {activity.language === 'multiple' 
                                  ? t('multipleLanguages') 
                                  : `${t('inLanguage')} ${activity.language}`}
                              </Badge>
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="sm" className="text-neutral-400 ml-2">
                            <i className="fas fa-ellipsis-v"></i>
                          </Button>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-neutral-100 inline-block p-4 rounded-full mb-4">
            <Clock className="h-8 w-8 text-neutral-300" />
          </div>
          <h3 className="text-lg font-medium text-neutral-400 mb-2">
            {searchQuery ? t('noMatchingActivities') : t('noActivities')}
          </h3>
          <p className="text-neutral-300">
            {searchQuery 
              ? t('tryDifferentSearch')
              : t('startUsingResponses')}
          </p>
        </div>
      )}
    </div>
  );
}
