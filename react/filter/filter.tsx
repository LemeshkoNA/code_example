import Input from "../../../common/Form/Input";
import Checkbox from "../../../common/Form/Checkbox";
import classes from './Styles.module.scss';
import {useContext, useEffect, useState} from "react";
import FilterContext from "./filter-context";

const Filter = ({manufacturers = []}) => {
    const maxPrice = 1000000;
    const [rangePriceValue, setRangePriceValue] = useState(maxPrice);
    const [inputPriceValue, setInputPriceValue] = useState(maxPrice);
    const filterContext = useContext(FilterContext);

    const manufacturesHandler = (value, {id}) => {
        const index = filterContext.manufacturers.findIndex(item => item === id);
        index >= 0 ?
            filterContext.manufacturers.splice(index, 1) :
            filterContext.manufacturers.push(id);
    }

    const setMaxPrice = async () => {
        setRangePriceValue(maxPrice);
        setInputPriceValue(maxPrice);
    }

    const changePrice = (input) => {
        const value = input.target.value
        if (value <= maxPrice) {
            setInputPriceValue(value)
            setRangePriceValue(value)
            filterContext.price = value
        }
    }

    return (
        <div className={classes.lots_filter}>
            <h4>Цена за тонну, ₽</h4>
            <input type={'range'} className={classes.range_select} min={0} value={rangePriceValue} max={maxPrice} step={1000}
                   onChange={changePrice}
            />
            <div className={classes.price_input}>
                <input type={"number"} value={inputPriceValue}
                       onInputCapture={changePrice}
                />
                <div onClick={() => setMaxPrice()}>Максимум</div>
            </div>
            <h4>Радиус поиска, км</h4>
            <RadiusSelect onChange={value => filterContext.distance = value}/>
            <h4>Необходимый объем, тонн</h4>
            <input type={'number'} className={classes.input}
                   // @ts-ignore
                   onInputCapture={input => filterContext.amount = input.target?.value || null}/>
            <h4>Производитель</h4>
            {manufacturers.map(item =>
                <div className={classes.checkbox_line}>
                    <Checkbox onChange={(value) => manufacturesHandler(value, item)}/>
                    <div>{item.name}</div>
                </div>
            )}
            <h4>Срок выполнения заказа, дней</h4>
            <div className={classes.completitionDays}>
                <input className={classes.input} type={'number'} placeholder={'от'}
                    // @ts-ignore
                       onInputCapture={input => filterContext.completitionDaysFrom = input.target.value || null}
                />
                <input className={classes.input} type={'number'} placeholder={'до'}
                    // @ts-ignore
                       onInputCapture={input => filterContext.completitionDaysTo = input.target.value || null}
                />
            </div>
            <div className={classes.checkbox_line}>
                <Checkbox onChange={value => filterContext.analogs = value}/>
                <div>Показать аналоги</div>
            </div>
        </div>
    )
}

const RadiusSelect = ({onChange}) => {
    const values = [50, 100, 200, 500, 1000];
    const [selectedValue, setSelectedValue] = useState(null);

    const selectValue = (value) => {
        let newValue
        if (value == '1000+'){
            newValue = null
        } else {
            newValue= selectedValue === value ? null : value

        }
        setSelectedValue(newValue);
        onChange(newValue)
    }

    const activeStyles = {
        backgroundColor: '#c7d0f5',
        color: '#ffffff'
    }

    return (
        <div className={classes.radius_select}>
            {values.map(item =>
                <div onClick={() => selectValue(item)} style={selectedValue === item ? activeStyles : null}>
                    <div>{item}</div>
                </div>
            )}
        </div>
    )
}

export default Filter;
