import { useEffect, useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close sidebar when route changes and implement smooth scrolling to top
  useEffect(() => {
    setIsOpen(false);
    // Scroll to top with smooth behavior when navigating to a new page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [location.pathname, setIsOpen]);

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="lg:hidden">
          <MenuIcon className="size-4 text-neutral-500" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetTitle>Menu</SheetTitle>
      </SheetContent>
    </Sheet>
  );
};
