import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, data } = body; // Your backend team will send these keys

    // Use a switch block to instantly handle updates across your Radio CMS
    switch (event) {
      case 'page_sections.updated':
        console.log("Hero zones changed:", data);
        revalidatePath('/dashboard/page-sections');
        break;

      case 'team.updated':
        console.log("Station team changed:", data);
        revalidatePath('/dashboard/team');
        break;

      case 'programs.updated':
        console.log("Radio programs changed:", data);
        revalidatePath('/dashboard/programs');
        break;

      case 'episodes.updated':
        console.log("Episodes archive updated:", data);
        revalidatePath('/dashboard/episodes');
        break;

      case 'articles.updated':
        console.log("News articles updated:", data);
        revalidatePath('/dashboard/articles');
        break;

      case 'gallery.updated':
        console.log("Media gallery updated:", data);
        revalidatePath('/dashboard/gallery');
        break;

      case 'comments.updated':
        console.log("User comments updated:", data);
        revalidatePath('/dashboard/comments');
        break;

      default:
        console.log("Unknown CMS event received:", event);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch  {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }
}
