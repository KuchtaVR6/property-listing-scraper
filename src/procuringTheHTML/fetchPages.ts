import {Browser} from "puppeteer";
import puppeteer from "puppeteer-extra";
import {HTMLElement, parse} from "node-html-parser";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import {getSelectorBasedOfSelector} from "../requirementMatcherHelpers";
import {SearchConfig} from "../types/configTypes";

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

export async function fetchWebsiteHTML(givenConfig: SearchConfig, url : string): Promise<HTMLElement> {
	const browser = await getBrowser();

	const page = await browser.newPage();

	await page.goto(url);
	try {
		await page.waitForSelector(getSelectorBasedOfSelector(givenConfig.requireToEstablishAsLoaded),
			{
				timeout: 5000
			});
	} catch (e) {
		console.log("Timeout! Check *requireToEstablishAsLoaded*");
	}

	const html = await page.content();

	return parse(html);
}