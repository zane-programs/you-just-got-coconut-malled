import Head from "next/head";

export default function Layout({
  children,
  title,
  description,
  overrideOGPTitle,
}) {
  return (
    <>
      <Head>
        <meta
          name="og:title"
          content={overrideOGPTitle || title || "You Just Got Coconut Malled!"}
        />
        <meta name="og:type" content="website" />
        {/* <meta name="og:image" content={props.imageURL} /> */}
        {/* <meta name="og:url" content={props.pageURL} /> */}
        <meta
          name="og:description"
          content={
            description ||
            "Create a clickbait story to totally coconut mall your friends."
          }
        />
        <title>{title ? `${title} | BreakingNews` : "Coconut Mall"}</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Rubik:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      {children}
    </>
  );
}
