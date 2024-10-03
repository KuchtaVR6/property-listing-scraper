import {Browser} from "puppeteer";
import puppeteer from "puppeteer-extra";
import {HTMLElement, parse} from "node-html-parser";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import {getSelectorBasedOfSelector} from "../requirementMatcherHelpers";
import {AttributeSelector} from "../types/configTypes";

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

let globalBrowser: null | Browser = null;

const getBrowser = async () => {
	if (!globalBrowser) {
		globalBrowser = await puppeteer.launch({
			headless: false,  // Set to false to ensure the browser window is visible
			defaultViewport: {
				width: 1920,     // Define a viewport width for the browser
				height: 1200,     // Define a viewport height
			}
		});
	}
	return globalBrowser;
};

export async function fetchHTML(url : string, loadedReq : AttributeSelector): Promise<HTMLElement> {
	const browser = await getBrowser();

	const page = await browser.newPage();

	console.log("-----------------> Fetching -> ", url);

	await page.goto(url);

	try {
		await page.waitForSelector(getSelectorBasedOfSelector(loadedReq),
			{
				timeout : 5000
			});
	} catch (e) {
		throw new Error("Timeout! Check *requireToEstablishAsLoaded*");
	}

	const html = await page.content();

	return parse(html);
}