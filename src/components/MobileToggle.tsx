import { AlignLeft } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import NavigationSidebar from "./navigation/NavigationSidebar";
import ServerSideBar from "./server/ServerSideBar";

export const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <AlignLeft />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>

        {/* in web view the server side bar is rendered through layout.tsx where we are getting the server id through params...but in the mobile view the sidebar hides so while initially loading the page the sidebar is not loaded so server id is also not fetched through params...so while toggling the sidebar we are passing the server id to the sidebar so that the sidebar shows all the data of the server */}
        <ServerSideBar id={serverId} />
      </SheetContent>
    </Sheet>
  );
};
