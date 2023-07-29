import {Category} from "../../types/configTypes";
import {GumtreeMethods} from "./valueRequirements";
import priceConfig from "../priceConfig";

const gumtreeCategories : Category[] = [
	{
		name: "En-Suite with bills",
		requirements: [
			GumtreeMethods.availabilityRequirement,
			GumtreeMethods.isEnSuite,
			GumtreeMethods.getPriceLowerThanArgumentReq(
				priceConfig.enSuiteWithBills),
			GumtreeMethods.includesBills
		]
	},
	{
		name: "En-Suite without bills",
		requirements: [
			GumtreeMethods.availabilityRequirement,
			GumtreeMethods.isEnSuite,
			GumtreeMethods.getPriceLowerThanArgumentReq(
				priceConfig.enSuiteWithoutBills),
		]
	},
	{
		name: "Room with bills",
		requirements: [
			GumtreeMethods.availabilityRequirement,
			GumtreeMethods.getPriceLowerThanArgumentReq(
				priceConfig.roomWithBills),
			GumtreeMethods.includesBills
		]
	},
	{
		name: "Room without bills",
		requirements: [
			GumtreeMethods.availabilityRequirement,
			GumtreeMethods.getPriceLowerThanArgumentReq(
				priceConfig.roomWithoutBills),
		]
	},
	{
		name: "Studio Flat with bills",
		requirements: [
			GumtreeMethods.availabilityRequirement,
			GumtreeMethods.isStudio,
			GumtreeMethods.includesBills,
			GumtreeMethods.getPriceLowerThanArgumentReq(
				priceConfig.studioPriceWithBills),
		]
	},
	{
		name: "Studio Flat without bills",
		requirements: [
			GumtreeMethods.availabilityRequirement,
			GumtreeMethods.isStudio,
			GumtreeMethods.getPriceLowerThanArgumentReq(
				priceConfig.studioPriceWithoutBills),
		]
	},
	{
		name: "Two bed flat",
		requirements: [
			GumtreeMethods.availabilityRequirement,
			GumtreeMethods.getIsNBedApartment(2),
			GumtreeMethods.getPriceLowerThanArgumentReq(
				priceConfig.twoBedFlat),
		]
	},
	{
		name: "Three bed flats",
		requirements: [
			GumtreeMethods.availabilityRequirement,
			GumtreeMethods.getIsNBedApartment(3),
			GumtreeMethods.getPriceLowerThanArgumentReq(
				priceConfig.threeBedFlat),
		]
	}
];

export default gumtreeCategories;