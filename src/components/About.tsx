import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Info, PlayCircle, Code, Github, Twitter, Globe } from 'lucide-react';
import { Button } from './ui/button';

interface AboutProps {
  onClose: () => void;
}

export const About = ({ onClose }: AboutProps) => {
  return (
    <div className='container mx-auto max-w-4xl py-12 px-4'>
      <div className='text-center mb-10 space-y-2'>
        <h1 className='text-4xl font-bold tracking-tight'>About This App</h1>
        <p className='text-muted-foreground'>
          Cine Vault 1.0.0 — Your tagline goes here
        </p>
      </div>

      <Tabs defaultValue='app' className='w-full'>
        <TabsList className='grid w-full grid-cols-3 mb-8'>
          <TabsTrigger value='app' className='flex items-center gap-2'>
            <Info className='w-4 h-4' /> App Info
          </TabsTrigger>
          <TabsTrigger value='tutorial' className='flex items-center gap-2'>
            <PlayCircle className='w-4 h-4' /> Tutorials
          </TabsTrigger>
          <TabsTrigger value='developer' className='flex items-center gap-2'>
            <Code className='w-4 h-4' /> Developer
          </TabsTrigger>
        </TabsList>

        {/* Section 1: App Info & Usage */}
        <TabsContent value='app'>
          <Card>
            <CardHeader>
              <CardTitle>
                Local-First Cinematic Intelligence Movie Management & Discovery
              </CardTitle>
              <CardDescription>
                Cine Vault is a cutting-edge Progressive Web App (PWA) designed
                to empower movie enthusiasts with seamless management of their
                personal film collections. By intelligently parsing local movie
                files, fetching enriched metadata from premier sources like IMDb
                and TMDB, and offering advanced categorization and filtering.
                Cine Vault transforms scattered downloads into a curated,
                offline-accessible cinematic repository. Whether you're
                archiving classics or discovering hidden gems, this app delivers
                a mind-blowing experience that blends local storage efficiency
                with global database insights—ensuring your library is always at
                your fingertips, even without an internet connection. Built for
                cross-platform compatibility which includes supports iOS and
                Android devices, allowing effortless installation as a
                native-like app directly from your browser..
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-sm leading-relaxed'>
                [Insert primary app description here. Describe the problem your
                app solves and its core mission.]
              </p>
              <div className='space-y-2'>
                <h3 className='font-semibold text-lg'>Key Features</h3>
                <ul className='list-disc list-inside text-sm text-muted-foreground space-y-1'>
                  <li>Feature One: [Brief description]</li>
                  <li>Feature Two: [Brief description]</li>
                  <li>Feature Three: [Brief description]</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 2: YouTube Tutorial Embed */}
        <TabsContent value='tutorial'>
          <Card>
            <CardHeader>
              <CardTitle>Video Guide</CardTitle>
              <CardDescription>
                Learn how to use the app in under 5 minutes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='aspect-video w-full overflow-hidden rounded-xl bg-muted border border-border'>
                {/* 
                  YouTube Embed: 
                  Replace "VIDEO_ID_HERE" with your actual YouTube video ID 
                */}
                <iframe
                  className='w-full h-full'
                  src='https://www.youtube.com'
                  title='App Tutorial'
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  allowFullScreen></iframe>
              </div>
              <div className='mt-4 p-4 rounded-lg bg-secondary/30'>
                <h4 className='font-medium text-sm mb-1'>Quick Start Tip:</h4>
                <p className='text-xs text-muted-foreground italic'>
                  [Add a helpful hint or common troubleshooting step here.]
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 3: Developer Info */}
        <TabsContent value='developer'>
          <Card>
            <CardHeader className='text-center'>
              <div className='flex justify-center mb-4'>
                <Avatar className='h-24 w-24 border-2 border-primary/20'>
                  <AvatarImage src='https://github.com' alt='Developer' />
                  <AvatarFallback>DEV</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className='text-2xl'>Shamil Khan</CardTitle>
              <CardDescription>
                [Title/Role — Full Stack Engineer]
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex flex-wrap justify-center gap-2'>
                <Badge variant='secondary'>React</Badge>
                <Badge variant='secondary'>TypeScript</Badge>
                <Badge variant='secondary'>Tailwind CSS</Badge>
                <Badge variant='secondary'>Shadcn UI</Badge>
              </div>

              <div className='flex justify-center gap-6 pt-4 border-t border-border'>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary transition-colors'>
                  <Github className='w-6 h-6' />
                </a>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary transition-colors'>
                  <Twitter className='w-6 h-6' />
                </a>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary transition-colors'>
                  <Globe className='w-6 h-6' />
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Button variant='ghost' onClick={() => onClose()}>
        Close
      </Button>
    </div>
  );
};
