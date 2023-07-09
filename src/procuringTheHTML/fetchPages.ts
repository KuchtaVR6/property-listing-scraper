import {Browser} from "puppeteer";
import puppeteer from "puppeteer-extra";
import searchConfig from "../searchConfig";
import {HTMLElement, parse} from "node-html-parser";
import * as fs from "fs";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import {getSelectorBasedOfRequirement} from "../requirementMatcherHelpers";

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

let globalBrowser : null | Browser = null;

const getBrowser = async () => {
	if (!globalBrowser) {
		globalBrowser = await puppeteer.launch({
			headless: "new"
		});
	}
	return globalBrowser;
};

export async function fetchWebsiteHTML(url: string): Promise<HTMLElement> {
	const browser = await getBrowser();

	const page = await browser.newPage();

	await page.goto(url);
	try {
		await page.waitForSelector(getSelectorBasedOfRequirement(searchConfig.requireToEstablishAsLoaded),
			{
				timeout: 5000
			});
	} catch (e) {
		console.log("Timeout! Check *requireToEstablishAsLoaded*");
	}

	const html = await page.content();

	fs.writeFileSync("htmlDump.html", html);

	const document = parse(html);
	return document;
}