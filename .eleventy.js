const yaml = require("js-yaml");

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addCollection("experience", (collectionApi) =>
    collectionApi.getFilteredByTag("experience").sort((a, b) => b.data.order - a.data.order)
  );

  eleventyConfig.addCollection("projects", (collectionApi) =>
    collectionApi.getFilteredByTag("project").sort((a, b) => b.data.order - a.data.order)
  );

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi.getFilteredByTag("post").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  eleventyConfig.addFilter("date", (value, format) => {
    const d = new Date(value);
    const opts = { timeZone: "UTC" };
    if (format === "MMM yyyy") {
      return d.toLocaleDateString("en-US", { ...opts, month: "short", year: "numeric" });
    }
    if (format === "MMMM d, yyyy") {
      return d.toLocaleDateString("en-US", { ...opts, month: "long", day: "numeric", year: "numeric" });
    }
    if (format === "yyyy-MM-dd") {
      return d.toISOString().slice(0, 10);
    }
    return d.toLocaleDateString("en-US", { ...opts, month: "2-digit", day: "2-digit", year: "numeric" });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
