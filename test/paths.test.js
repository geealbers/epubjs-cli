import { describe, it } from "node:test";
import assert from "node:assert";
import { relativeResourcePath } from "../src/epub.js";

describe("relativeResourcePath", () => {
	it("computes forward-slash relative paths from POSIX file URLs", () => {
		const manifest = "file:///Users/x/book/manifest.jsonld";
		const resource = "file:///Users/x/book/_assets/images/cover.jpg";

		assert.equal(relativeResourcePath(manifest, resource), "_assets/images/cover.jpg");
	});

	it("uses forward slashes for Windows file URLs (issue #1)", () => {
		// On Windows the default `path` module is the win32 implementation, which
		// emits backslash separators. EPUB OPF hrefs and ZIP entry names must always
		// use "/". These are the file:// URLs pathToFileURL produces on Windows.
		const manifest = "file:///C:/Users/x/book/manifest.jsonld";
		const resource = "file:///C:/Users/x/book/_assets/images/cover.jpg";

		const relative = relativeResourcePath(manifest, resource);

		assert.equal(relative, "_assets/images/cover.jpg");
		assert.ok(!relative.includes("\\"), "must not contain backslashes");
	});

	it("handles a resource in the manifest's own directory", () => {
		const manifest = "file:///C:/Users/x/book/manifest.jsonld";
		const resource = "file:///C:/Users/x/book/chapter_001.html";

		assert.equal(relativeResourcePath(manifest, resource), "chapter_001.html");
	});
});
