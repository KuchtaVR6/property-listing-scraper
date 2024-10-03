import {Category} from "../../types/configTypes";
import {GumtreeMethods} from "./valueRequirements";
import priceConfig from "../priceConfig";

const gumtreeCategories : Category[] = [
	{
		name: "EnSuite Room Bills Included",
		shallowRequirements: [
			GumtreeMethods.availabilityRequirement,
			GumtreeMethods.isEnSuite,
			GumtreeMethods.getPriceLowerThanArgumentReq(
				priceConfig.enSuiteWithBills),
		],
		deepScoreMethods: [
			GumtreeMethods.mustIncludeBills
		]
	},
	{
		name: "EnSuite Room w/o Bills Included",
		shallowRequirements: [
			GumtreeMethods.availabilityRequirement,
			GumtreeMethods.isEnSuite,
			GumtreeMethods.getPriceLowerThanArgumentReq(
				priceConfig.enSuiteWithoutBills),
		],
		deepScoreMethods: []
	},
	{
		name: "Room Bills Included",
		shallowRequirements: [
			GumtreeMethods.availabilityRequirement,
			GumtreeMethods.getPriceLowerThanArgumentReq(
				priceConfig.roomWithBills),
		],
		deepScoreMethods: [
			GumtreeMethods.mustIncludeBills
		]
	},
	{
		name: "Room w/o Bills Included",
		shallowRequirements: [
			GumtreeMethods.availabilityRequirement,
			GumtreeMethods.getPriceLowerThanArgumentReq(
				priceConfig.roomWithoutBills),
		],
		deepScoreMethods: []
	},
	{
		name: "Studio flat Bills Included",
		shallowRequirements: [
			GumtreeMethods.availabilityRequirement,
			GumtreeMethods.isStudio,
			GumtreeMethods.getPriceLowerThanArgumentReq(
				priceConfig.studioPriceWithBills),
		],
		deepScoreMethods: [
			GumtreeMethods.mustIncludeBills
		]
	},
	{
		name: "Studio flat w/o Bills Included",
		shallowRequirements: [
			GumtreeMethods.availabilityRequirement,
			GumtreeMethods.isStudio,
			GumtreeMethods.getPriceLowerThanArgumentReq(
				priceConfig.studioPriceWithoutBills),
		],
		deepScoreMethods: []
	},
	{
		name: "Two bed flat",
		shallowRequirements: [
			GumtreeMethods.availabilityRequirement,
			GumtreeMethods.getIsNBedApartment(2),
			GumtreeMethods.getPriceLowerThanArgumentReq(
				priceConfig.twoBedFlat),
		],
		deepScoreMethods: []
	},
	{
		name: "Three bed flats",
		shallowRequirements: [
			GumtreeMethods.availabilityRequirement,
			GumtreeMethods.getIsNBedApartment(3),
			GumtreeMethods.getPriceLowerThanArgumentReq(
				priceConfig.threeBedFlat),
		],
		deepScoreMethods: []
	}
];

export default gumtreeCategories;