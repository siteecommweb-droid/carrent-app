const STRAPI = "http://localhost:1337/api";

export async function fetchPromotions() {
  const res = await fetch(`${STRAPI}/promotions?populate=*`);
  return res.json();
}

export async function fetchBlogPosts() {
  const res = await fetch(`${STRAPI}/blog-posts?populate=*`);
  return res.json();
}

export async function fetchFaqs() {
  const res = await fetch(`${STRAPI}/faqs`);
  return res.json();
}




