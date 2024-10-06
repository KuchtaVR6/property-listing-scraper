import {Browser} from "puppeteer";
import puppeteer from "puppeteer-extra";
import {HTMLElement, parse} from "node-html-parser";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import {getSelectorBasedOfSelector} from "../requirementMatcherHelpers";
import {AttributeSelector, NormalDistributionArgs} from "../types/configTypes";

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
			}
		});
	}
	return globalBrowser;
};

function sampleNormalDistribution(args: NormalDistributionArgs): number {
	// Using Box-Muller transform to generate a sample from a normal distribution
	let u = 0, v = 0;
	while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
	while (v === 0) v = Math.random();
	return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * args.std + args.mean;
}

// Last request time tracker
let lastRequestCompleted = 0;

export async function fetchHTML(
	url: string, loadedReq: AttributeSelector, minDelay?: NormalDistributionArgs): Promise<HTMLElement> {

	const browser = await getBrowser();
	const page = await browser.newPage();

	// Check if we need to enforce a delay between requests
	if (minDelay && lastRequestCompleted) {
		const currentTime = Date.now();
		const elapsedTime = currentTime - lastRequestCompleted;

		// Sample a delay from the normal distribution
		const sampledDelay = sampleNormalDistribution(minDelay);

		// Wait until the elapsed time is greater than or equal to the sampled delay
		if (elapsedTime < sampledDelay) {
			const waitTime = sampledDelay - elapsedTime;
			console.log(`Waiting for ${waitTime}ms to meet the minimum delay requirement...`);
			await new Promise(resolve => setTimeout(resolve, waitTime));
		}
	}

	console.log("-----------------> Fetching -> ", url);

	await page.goto(url);

	try {
		await page.waitForSelector(getSelectorBasedOfSelector(loadedReq), { timeout: 5000 });
	} catch (e) {
		throw new Error("Timeout! Check *requireToEstablishAsLoaded*");
	}

	const html = await page.content();

	lastRequestCompleted = Date.now(); // Record the time when the request is completed

	setTimeout(() => {
		page.close();
	}, 4000);

	return parse(html);
}
