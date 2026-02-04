import { useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Info, PlayCircle, Code, Github, Twitter, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

// import type { Root, Heading, Text, Link, Image } from 'mdast';
import type { Root, Text, Link } from 'mdast';
import { remove } from 'unist-util-remove';
import readmeRaw from '/README.md?raw';

const normalizeTitle = (text: string) =>
  text.replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '').trim();

function remarkRemoveBadges() {
  return (tree: Root) => {
    remove(tree, (node) => {
      // 1. Remove standalone images that look like badges (usually in the first few nodes)
      if (node.type === 'image') return true;

      // 2. Remove links that contain images (common badge format)
      if (node.type === 'link') {
        const link = node as Link;
        return link.children.some((child) => child.type === 'image');
      }

      return false;
    });
  };
}

// function remarkFilterSection(sectionTitle: string) {
//   return (tree: Root) => {
//     let isTargetSection = false;
//     let targetDepth = 0;

//     tree.children = tree.children.filter((node) => {
//       if (node.type === 'heading') {
//         // Extract text content from heading children
//         const textValue = node.children
//           .filter((c): c is Text => 'value' in c)
//           .map((c) => c.value)
//           .join('');

//         if (textValue === sectionTitle) {
//           isTargetSection = true;
//           targetDepth = node.depth;
//           return true;
//         }

//         if (isTargetSection && node.depth <= targetDepth) {
//           isTargetSection = false;
//         }
//       }
//       return isTargetSection;
//     });
//   };
// }

function remarkFilterMultipleSections(sectionTitles: string[]) {
  const normalizedTargets = sectionTitles.map((t) =>
    normalizeTitle(t).toLowerCase(),
  );

  return (tree: Root) => {
    let currentLevel: number | null = null;
    let keepNode = false;

    tree.children = tree.children.filter((node) => {
      if (node.type === 'heading') {
        const titleText = node.children
          .filter((c): c is Text => 'value' in c)
          .map((c) => c.value)
          .join('');

        const cleanTitle = normalizeTitle(titleText).toLowerCase();
        const isMatch = normalizedTargets.includes(cleanTitle);

        if (isMatch) {
          keepNode = true;
          currentLevel = node.depth;
          return true; // Keep the heading
        }

        // Stop keeping nodes if we hit a heading of same or higher level
        if (keepNode && currentLevel !== null && node.depth <= currentLevel) {
          keepNode = false;
          currentLevel = null;
        }
      }
      return keepNode;
    });
  };
}

interface AboutProps {
  onClose: () => void;
}

const MarkDownSections = ['Cine Vault', 'Key Innovations', 'Key Features'];

export const About = ({ onClose }: AboutProps) => {
  const [readmeText, setReadMeText] = useState('');

  useEffect(() => {
    const processMarkdown = async () => {
      const file = await unified()
        .use(remarkParse) // Parse to MD AST
        .use(remarkGfm)
        .use(() => remarkFilterMultipleSections(MarkDownSections))
        .use(remarkRemoveBadges)
        .use(remarkRehype) // MD AST to HTML AST
        .use(rehypeStringify) // HTML AST to String
        .process(readmeRaw);

      const html = String(file);
      setReadMeText(html);
    };
    processMarkdown();
  }, []);

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
            <CardContent className='space-y-4'>
              <div className='space-y-2 readme-container'>
                <div
                  className='text-left w-full markdown-body'
                  dangerouslySetInnerHTML={{ __html: readmeText }}
                />
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
                Learn how to use the Cine Vault in under 5 minutes. (Coming
                Soon)
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
                  Typa a movie name in search bar.
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
                  <AvatarImage
                    src='https://avatars.githubusercontent.com/u/293682?v=4'
                    alt='Developer'
                  />
                  <AvatarFallback>DEV</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className='text-2xl'>Shamil Khan شمیل خان</CardTitle>
              <CardDescription>
                [Software Architect — Full Stack Engineer]
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex justify-center gap-6 pt-4 border-t border-border'>
                <a
                  href='https://github.com/shamil-khan'
                  className='text-muted-foreground hover:text-primary transition-colors'>
                  <Github className='w-6 h-6' />
                </a>
                <a
                  href='https://x.com/iShamilKhan'
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
      <div className='py-4'>
        <Button
          variant='ghost'
          onClick={() => onClose()}
          className='w-full flex items-center gap-2'>
          Close
        </Button>
      </div>
    </div>
  );
};
