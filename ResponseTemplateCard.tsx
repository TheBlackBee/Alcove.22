import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Copy, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponseTemplate } from "@/types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface ResponseTemplateCardProps {
  template: ResponseTemplate;
}

export default function ResponseTemplateCard({ template }: ResponseTemplateCardProps) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [showActions, setShowActions] = useState(false);
  
  const currentLanguage = i18n.language as keyof typeof template.content;
  const content = template.content[currentLanguage] || template.content.en || Object.values(template.content)[0];
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: t("copied"),
      description: t("responseCopiedToClipboard"),
    });
  };
  
  return (
    <Card 
      className="bg-white rounded-lg shadow transition-shadow hover:shadow-md"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardHeader className="p-4 border-b border-neutral-200 flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium text-base flex items-center">
          <span 
            className="flex-shrink-0 h-2 w-2 rounded-full mr-2"
            style={{ backgroundColor: template.categoryColor }}
          ></span>
          {template.title}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              {t("copy")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <i className="fas fa-edit mr-2"></i>
              {t("edit")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <i className="fas fa-trash-alt mr-2"></i>
              {t("delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-neutral-400 line-clamp-3">
          {content}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-language text-neutral-300 mr-1"></i>
            <span className="text-xs text-neutral-300">
              {template.languages.length} {t("languages")}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8"
            >
              {t("editTemplate")}
            </Button>
            <Button 
              size="sm" 
              onClick={handleCopy}
              className="text-xs h-8 bg-primary hover:bg-secondary text-white"
            >
              {t("useTemplate")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
