import {Browser} from "puppeteer";
import puppeteer from "puppeteer-extra";
import {HTMLElement, parse} from "node-html-parser";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import {getSelectorBasedOfSelector} from "../requirementMatcherHelpers";
import {SearchConfig} from "../types/configTypes";
import * as fs from "fs";

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

let globalBrowser: null | Browser = null;

const getBrowser = async () => {
	if (!globalBrowser) {
		globalBrowser = await puppeteer.launch({
			headless: false,  // Set to false to ensure the browser window is visible
			defaultViewport: {
				width: 1280,     // Define a viewport width for the browser
				height: 720,     // Define a viewport height
			},
			args: ["--start-maximized"]  // Starts the browser maximized for better preview
		});
	}
	return globalBrowser;
};


export async function fetchWebsiteHTML(givenConfig: SearchConfig, url : string): Promise<HTMLElement> {
	const browser = await getBrowser();

	const page = await browser.newPage();

	console.log("-----------------> Fetching -> ", url);

	await page.goto(url);

	const preLoadHtml = await page.content();

	fs.writeFileSync("htmlDump.html",preLoadHtml.toString());

	try {
		await page.waitForSelector(getSelectorBasedOfSelector(givenConfig.requireToEstablishAsLoaded),
			{
				timeout : 5000
			});
	} catch (e) {
		throw new Error("Timeout! Check *requireToEstablishAsLoaded*");
	}

	const html = await page.content();

	fs.writeFileSync("htmlDump.html",html.toString());

	return parse(html);
}