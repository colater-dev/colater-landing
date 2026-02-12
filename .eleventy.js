module.exports = function (eleventyConfig) {
  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/js");

  // Blog collection — all posts sorted by date descending
  eleventyConfig.addCollection("blog", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/**/*.md").sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });
  });

  // Date formatting filter
  eleventyConfig.addFilter("dateFormat", function (date) {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Reading time filter
  eleventyConfig.addFilter("readingTime", function (content) {
    const words = content ? content.split(/\s+/).length : 0;
    const minutes = Math.ceil(words / 220);
    return `${minutes} min read`;
  });

  // Year filter for footer copyright
  eleventyConfig.addFilter("year", function () {
    return new Date().getFullYear();
  });

  // Excerpt filter — first paragraph
  eleventyConfig.addFilter("excerpt", function (content) {
    if (!content) return "";
    const match = content.match(/<p>(.*?)<\/p>/);
    return match ? match[1] : content.substring(0, 200) + "...";
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
