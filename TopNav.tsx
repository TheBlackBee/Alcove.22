import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMobileMenu } from "@/lib/MobileMenuContext";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { PlusIcon, MenuIcon, SearchIcon, BellIcon, ChevronDownIcon } from "lucide-react";
import { NewResponseDialog } from "@/components/dialog/NewResponseDialog";
import QRCode from 'qrcode.react';

function QRCodeDisplay() {
  const url = window.location.href;
  return (
    <div className="mt-4">
      <QRCode value={url} size={128} level="H" />
      <p className="text-center text-sm mt-2">Scan to open on mobile</p>
    </div>
  );
}

export default function TopNav() {
  const { t, i18n } = useTranslation();
  const { openMenu } = useMobileMenu();
  const isMobile = useMobile();
  const [showNewResponseDialog, setShowNewResponseDialog] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      {/* Mobile header */}
      {isMobile && (
        <div className="md:hidden w-full bg-white border-b border-neutral-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-primary">DesignResponder</h1>
          <button className="text-neutral-400" onClick={openMenu}>
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Desktop header */}
      <header className="bg-white border-b border-neutral-200 p-4 hidden md:flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300 h-4 w-4" />
            <Input 
              type="text" 
              placeholder={t('searchResponses')}
              className="pl-10 pr-4 py-2 w-64"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center text-sm">
                <i className="fas fa-language mr-2 text-primary"></i>
                {i18n.language === 'en' ? 'English' : i18n.language === 'es' ? 'Español' : 'Français'}
                <ChevronDownIcon className="ml-2 h-4 w-4 text-neutral-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('es')}>
                Español
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('fr')}>
                Français
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            className="bg-primary hover:bg-secondary text-white"
            onClick={() => setShowNewResponseDialog(true)}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            {t('newResponse')}
          </Button>

          <Button variant="ghost" size="icon" className="relative text-neutral-400 hover:text-primary">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-error"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                  AM
                </div>
                <span className="ml-2 text-sm font-medium">Alex Morgan</span>
                <ChevronDownIcon className="ml-2 h-4 w-4 text-neutral-300" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <i className="fas fa-user mr-2"></i>
                {t('profile')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <i className="fas fa-cog mr-2"></i>
                {t('settings')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <i className="fas fa-sign-out-alt mr-2"></i>
                {t('signOut')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <NewResponseDialog 
        open={showNewResponseDialog} 
        onOpenChange={setShowNewResponseDialog} 
      />
      <QRCodeDisplay />
    </>
  );
}