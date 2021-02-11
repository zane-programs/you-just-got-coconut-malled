import Layout from "../../components/Layout";

export default function StoryView({ headline, description }) {
  return (
    <Layout
      overrideOGPTitle={`BREAKING: ${headline}`}
      title={headline}
      description={description}
    >
      <h1>{headline}</h1>
      <aside>{description}</aside>
    </Layout>
  );
}

export const getServerSideProps = async ({ params, query }) => {
  const headline = convertSlugToHeadline(params.slug);
  let description;

  description =
    query?.d && query.d !== "" && /[A-Za-z0-9+/=]/.test(query.d)
      ? Buffer.from(query.d, "base64").toString()
      : (description = generateDefaultDescription(headline));

  return {
    props: { headline, description },
  };
};

const capitalize = (word) => word.charAt(0).toUpperCase() + word.substring(1);
const convertSlugToHeadline = (slug) =>
  slug
    .split("-")
    .map((word) => capitalize(word))
    .join(" ");

const generateDefaultDescription = (headline) =>
  `BREAKING NEWS: ${headline}. See it now on BreaklngNews.live`;
