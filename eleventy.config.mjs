import { HtmlBasePlugin } from "@11ty/eleventy";
import taskLists from "markdown-it-task-lists";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.amendLibrary("md", (md) => md.use(taskLists));

  eleventyConfig.addPassthroughCopy({ "content/css": "css" });

  eleventyConfig.addCollection("weeks", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("content/weeks/week-*.md")
      .sort((a, b) => b.data.week - a.data.week)
  );

  return {
    dir: {
      input: "content",
      includes: "_includes",
    },
    markdownTemplateEngine: "njk",
  };
}
