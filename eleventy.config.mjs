import { HtmlBasePlugin } from "@11ty/eleventy";
import taskLists from "markdown-it-task-lists";
import { PLAN, weightChart, adherenceChart, statTiles, progressTable, adherence } from "./lib/charts.mjs";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.amendLibrary("md", (md) => md.use(taskLists));

  eleventyConfig.addPassthroughCopy({ "content/css": "css" });
  eleventyConfig.addPassthroughCopy({ "content/js": "js" });

  eleventyConfig.addCollection("weeks", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("content/weeks/week-*.md")
      .sort((a, b) => b.data.week - a.data.week)
  );

  eleventyConfig.addGlobalData("plan", PLAN);

  eleventyConfig.addShortcode("weightChart", weightChart);
  eleventyConfig.addShortcode("adherenceChart", adherenceChart);
  eleventyConfig.addShortcode("statTiles", statTiles);
  eleventyConfig.addShortcode("progressTable", progressTable);
  eleventyConfig.addShortcode("adherenceBadge", (week) => {
    const a = adherence(week);
    return `<span class="badge">${a.done}/${a.total} done</span>`;
  });

  return {
    dir: {
      input: "content",
      includes: "_includes",
    },
    markdownTemplateEngine: "njk",
  };
}
