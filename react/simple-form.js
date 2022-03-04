import React from 'react';
import "../assets/scss/ui/simple-form.scss"
import Button from './button';
import {FormGroup, InputGroup, TextArea, Label} from "@blueprintjs/core";

export default class SimpleForm extends React.Component {
    constructor(props) {
        super(props);
        const initState = {}
        this.fields = this.props.fields.map(field => {
            initState[field.name] = field.defaultValue || '';
            return (
                <FormGroup className={field.className || ''}>
                    <Label>{field.label}</Label>
                    {field.textArea ?
                        <TextArea id={field.name} placeholder={field.placeholder || ''} /> :
                        <InputGroup id={field.name} placeholder={field.placeholder || ''} />
                    }
                </FormGroup>
            )
        });
        this.state = {...initState}
    }

    componentDidMount() {
        this.inputs = [
            ...Array.from(document.getElementsByTagName('input')),
            ...Array.from(document.getElementsByTagName('textarea'))
        ]
        this.inputs.forEach(element => {
            element.addEventListener('input', input => {
                const {id, value} = input.target;
                this.setState({[id]: value})
            })
        });
    }

    render() {
        const submit = () => {
            this.props.submitRequest(this.state).then(status => {
                status && this.inputs.forEach(element => element.value = '');
            })
        }

        const checkValid = () => {
            const keys = Object.keys(this.state);
            return !keys.every((key) => this.state[key])
        }

        return (
            <div className={'simple-form'}>
                <div className={'title'}>{this.props.title || ''}</div>
                <div className={'body'}>{this.fields}</div>
                <Button disabled={checkValid()} onClick={() => submit()}>{this.props.sumbitText || ''}</Button>
            </div>
        )
    }
}
