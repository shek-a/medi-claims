I'm building a full-stack medical claims management application called 'medi-claims' using Next.js 15, TypeScript, and Tailwind CSS. Please help me create a modern, professional application with the following requirements:

Design & Styling:

- Use a modern design with various shades of blue (#1e40af, #3b82f6, #60a5fa, #93c5fd, #dbeafe)
- Responsive design that works on desktop, tablet, and mobile
- Clean, professional healthcare industry aesthetic
- Use Tailwind CSS for styling
- Using Clerk for User Access Mangement


Pages & Features:

1. Home Page - Unauthenticated users
   URL: <host>
   Landing page with image (public/images/medi-claims-home-page-image.png) stretching the width of the page

2. Welcome Page - home page for authenticated users 
   URL: <host>
   - Page should contain the text "Welcome <name of authenticated user>"
  
3. Dashboard - blank for now
   URL: <host>/dashboard 


Key Components to Create:

Navigation header with logo
   - Will be across all pages at the top
   - logo (public/medi-claims-logo.png) will be located at the far left
   - In the Home Page show the "Login" and "Sign Up" button located at the far right.  These buttons will be rentangular with rounded corners
   - Use the 'sample nav bar.png' as a guide on how the navigation will look like only from a styling (css) perspective (don't copy the logo or the nav links)
   - The links I want only when the user is signed in are
       - Home
       - Dashboard
   - When the user isn't signed just show the "Login" and "Sign Up" button
   - When the user is signed in in addition to the "Home" and "Dashbaord" nav links, there should be a "Sign Out" buton the the far right.
   - choose appropriate svg icons to be place along side the 'Home' and 'Dashboard' links