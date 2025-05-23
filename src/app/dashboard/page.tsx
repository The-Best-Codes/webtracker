import { auth } from "@/auth";
import AddWebsite from "@/components/dashboard/add-website";
import { WebsiteCard } from "@/components/dashboard/wesbite-card";
import { Button } from "@/components/ui/button";
import {redirect} from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { getAllProjects } from "../actions/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | WebTracker",
  },
  description: "A web analytics tool for tracking user behavior and performance - Dashboard",
};


export default async function Dashboard(){
    const session = await auth();
    if(!session){
      redirect("/");
    }

    if(!session?.user?.id){
      redirect("/");
    }

    const projects = await getAllProjects(session.user.id);

    
    return(
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-500 dark:text-blue-300">Your Websites</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="dark:bg-blue-700 dark:hover:bg-blue-600 dark:text-white">
                <Plus className="h-4 w-4" />
                Add Website
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white p-4 max-w-lg sm:max-w-xl mx-auto dark:bg-zinc-900">
              <DialogTitle className="sr-only">Add a new website</DialogTitle>
              <AddWebsite />
            </DialogContent>
          </Dialog>
        </div>
        {projects?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-400 dark:text-neutral-300">No websites added yet.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((website) => (
            <WebsiteCard 
              key={website.id} 
              website={{
                id: website.id,
                name: website.name,
                domain: website.domain || "",
                description: website.description || "",
                analytics:{
                  totalPageVisits: website?.analytics?.totalPageVisits || 0,
                  totalVisitors: website?.analytics?.totalVisitors || 0,
                }
              }} 
            />
          ))}
        </div>
        )}
      </div>
    </div>
    )
}