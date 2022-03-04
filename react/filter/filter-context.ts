import {createContext} from "react";

interface IFilterContext {
    price: string | number,
    distance: string | number,
    amount: any,
    manufacturers: any[],
    completitionDaysFrom: any,
    completitionDaysTo: any,
    product: string | number,
    longitude: string | number,
    latitude: string | number,
    analogs: boolean,
}

const FilterContext =  createContext<IFilterContext>({
    price: null,
    distance: null,
    amount: null,
    manufacturers: [],
    completitionDaysFrom: null,
    completitionDaysTo: null,
    product: null,
    longitude: null,
    latitude: null,
    analogs: false,
});

export default FilterContext;
