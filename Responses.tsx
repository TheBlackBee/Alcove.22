import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PlusIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ResponseTemplateCard from '@/components/dashboard/ResponseTemplateCard';
import { NewResponseDialog } from '@/components/dialog/NewResponseDialog';
import { ResponseTemplate, Category } from '@/types';

export default function Responses() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewResponseDialog, setShowNewResponseDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch templates
  const { data: templates, isLoading: isLoadingTemplates } = useQuery<ResponseTemplate[]>({
    queryKey: ['/api/templates'],
  });

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Filter templates based on search query and selected category
  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = 
      searchQuery === '' || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(template.content).some(content => 
        content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      template.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-400">{t('responses')}</h2>
        <p className="text-neutral-300">{t('manageYourResponses')}</p>
      </div>
      
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300 h-4 w-4" />
          <Input
            type="text"
            placeholder={t('searchResponses')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button 
          onClick={() => setShowNewResponseDialog(true)}
          className="bg-primary hover:bg-secondary text-white w-full sm:w-auto"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          {t('newResponse')}
        </Button>
      </div>
      
      {/* Categories Tabs */}
      <Tabs 
        defaultValue="all" 
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="mb-6"
      >
        <TabsList className="bg-transparent border-b border-neutral-200 w-full justify-start overflow-x-auto">
          <TabsTrigger 
            value="all"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
          >
            {t('all')}
          </TabsTrigger>
          
          {isLoadingCategories ? (
            // Loading placeholders for categories
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-neutral-200 animate-pulse mx-1 rounded"></div>
            ))
          ) : categories ? (
            categories.map(category => (
              <TabsTrigger 
                key={category.id}
                value={category.name.toLowerCase()}
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
              >
                {category.name}
              </TabsTrigger>
            ))
          ) : null}
        </TabsList>
        
        <TabsContent value={selectedCategory} className="mt-6">
          {isLoadingTemplates ? (
            // Loading placeholders for templates
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-5 bg-neutral-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTemplates && filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <ResponseTemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-neutral-100 inline-block p-4 rounded-full mb-4">
                <FilterIcon className="h-8 w-8 text-neutral-300" />
              </div>
              <h3 className="text-lg font-medium text-neutral-400 mb-2">
                {searchQuery ? t('noMatchingResponses') : t('noResponses')}
              </h3>
              <p className="text-neutral-300 mb-6">
                {searchQuery 
                  ? t('tryDifferentSearch')
                  : t('createYourFirstResponse')}
              </p>
              <Button 
                onClick={() => setShowNewResponseDialog(true)}
              >
                {t('newResponse')}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <NewResponseDialog 
        open={showNewResponseDialog} 
        onOpenChange={setShowNewResponseDialog} 
      />
    </div>
  );
}
