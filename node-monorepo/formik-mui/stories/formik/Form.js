import React, {PureComponent} from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {Formik, Form, setIn} from 'formik';
import {Input, Button, currencify} from '../../src';

class DemoForm extends PureComponent {
	constructor(props) {
		super(props);
		this.hSubmit = this.hSubmit.bind(this);
		this.validate = this.validate.bind(this);
	}
	static arrayMeta = [
		{name: 'type', label: 'Type', required: true, type: 'select', container: {xs: 4}, options: [
			{value: 'p', label: 'Personal'},
			{value: 'w', label: 'Work'},
		]},
		{name: 'mobile', label: 'Mobile', required: true, type: 'mobile', container: {xs: 7}},
	]
	validate(values) {
		let errors = {};
		if ((values.negotiable || {}).no || !(values.negotiable || {}).upto) return errors;
		let diff = (values.current.value - values.negotiable.upto) * 100 / values.current.value;
		let minDiff = values.current.value > 20000000 ? 7 : values.current.value > 10000000 ? 5 : 3, maxDiff = 10;
		if (diff < minDiff || diff > maxDiff) {
			errors = setIn(errors, 'negotiable.upto', diff > maxDiff
				? `The difference must be less than ${maxDiff}%. Negotiable Upto must be more than ${currencify({amount: Math.round((100 - maxDiff) * values.current.value / 100), abbreviated: true})}`
				: `The difference must be more than ${minDiff}%. Negotiable Upto must be less than ${currencify({amount: Math.round((100 - minDiff) * values.current.value / 100), abbreviated: true})}`
			);
		}
		return errors;
	}
	hSubmit(values, {setSubmitting}) {
		this.props.onSubmit(values);
		setTimeout(() => {
			setSubmitting(false);
		}, 1000);
	}
	PreviewsChildren({name, index}) {
		return <Input type='select' name={`${name}.${index}.tags`} multiple placeholder='Tag' options={[{value: 1, label: '1'}, {value: 2, label: '2'}]} InputProps={{classes: {input: 'font-small'}}}/>;
	}
	render() {
		const initialValues = {phones: [{mobile: '80808080'}], currency: 900000, files: [{name: '1.pdf'}, {name: 'very very very very long file name.pdf'}, {name: '2.json'}]};

		return (
			<Grid container item spacing={8} style={{padding: '2rem'}}>
				<Formik initialValues={initialValues} enableReinitialize={true} isInitialValid={false} onSubmit={this.hSubmit} validate={this.validate}>
					{({isSubmitting, values, errors, isValid}) => <Form  autoComplete='off' style={{width: '100%'}}>
						<Grid container item spacing={8} xs={12}>
							<Grid item xs={6}>
								<Typography>Phones (Array of Inputs)</Typography>
								<Input type='array' name='phones' metaList={DemoForm.arrayMeta} container={{xs: 12}}/>
								<Input type='file' name='files' label='File Drop' container={{xs: 12}} filesLimit={10}
									handleUpload={(file, cb) => setTimeout(() => {
										cb(new Error(403, 'failed'));
									}, 1000)}
									handleDelete={(file, cb) => setTimeout(() => {
										cb(new Error(403, 'failed'));
									}, 1000)}
									comps={{PreviewsChildren: this.PreviewsChildren}}
								/>
							</Grid>
							<Grid item xs={6}>
								<Grid container direction='column'>
									<Grid container item style={{marginTop: '16px'}} xs={12} spacing={8}>
										<Input name='month' type='month' label='Month' container={{xs: 4}}/>
										<Input name='date' fast={false} type='date' label='Date' container={{xs: 4}}/>
										<Input name='currency' type='inr' label='Currency' container={{xs: 4}}/>
									</Grid>
									<Grid container item style={{marginTop: '16px'}} xs={12} spacing={8}>
										<Input required mui name='mui' type='select' label='Select (Material UI)' helperText='`prop: mui` to use mui select (default: false)' container={{xs: 6}} options={[
											{value: '1', label: 'Reason 1'},
											{value: '2', label: 'Reason 2'},
										]}/>
										<Input mui multiple name='mui.multi' type='select' helperText='`prop: mui` to use mui select (default: false)' container={{xs: 6}} options={[
											{value: '', label: 'Multiple Mui'},
											{value: '2', label: 'Reason 2'},
										]}/>
										<Input required name='react.select' type='select' label='Select (React Select)' helperText='Default select is react-select' container={{xs: 6}} optionsAsync={function(v, cb) {
											cb([
												{value: '1', label: '1'},
												{value: '2', label: '2'},
											].filter(({value}) => !v || value === v));
										}}/>
									</Grid>
									<Grid container item style={{marginTop: '16px'}} xs={12} spacing={8}>
										<Input required disabled name='react.select' type='select' label='Select (React Select)' helperText='disabled react-select' container={{xs: 6}} optionsAsync={function(v, cb) {
											cb([
												{value: '1', label: '1'},
												{value: '2', label: '2'},
											].filter(({value}) => !v || value === v));
										}}/>
										<Input required readOnly name='react.select' type='select' label='Select (React Select)' helperText='readOnly react-select' container={{xs: 6}} optionsAsync={function(v, cb) {
											cb([
												{value: '1', label: '1'},
												{value: '2', label: '2'},
											].filter(({value}) => !v || value === v));
										}}/>
									</Grid>
									<Grid container item style={{marginTop: '16px'}} xs={12} spacing={8}>
										<Input name='textArea' multiline label='Text Area' multiline container={{xs: 6}}/>
										<Input name='textBox' label='Text Box' container={{xs: 6}}/>
									</Grid>
								</Grid>
							</Grid>
							<Grid container item xs={12} justify='center'>
								<Button type='submit' variant='contained' size='small' disabled={!isValid || isSubmitting} processing={isSubmitting} label='Submit'/>
							</Grid>
							<Grid container item xs={12} justify='center'>
								Values: {JSON.stringify(values)}
							</Grid>
							<Grid container item xs={12} justify='center'>
								Errors: {JSON.stringify(errors)}
							</Grid>
						</Grid>
					</Form>}
				</Formik>
			</Grid>
		);
	}
}

export default DemoForm;
