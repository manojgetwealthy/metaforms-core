import React, { Fragment, useContext, useEffect, useState } from "react";
import FormContext from './form-context';
import FormUtils from "./../utils/FormUtil";
import { IField, ITheme } from "../constants/model-interfaces";
import FormControl from "./form-controls";
import Row from "./layout/Row";
import Col from "./layout/Col";
import { IRenderField } from "../constants/common-interface";

export default function FormFieldRenderer(props: IRenderField) {
    if (props?.meta?.type === 'hidden') {
        return (<Fragment></Fragment>);
    }
    const isStandalone = props?.meta?.displayProps?.isStandalone ? true : false;
    const isSection = props?.meta?.type === 'section';
    const cssClassName = FormUtils.getCssClassName(props.meta.displayProps);
    const [cField, setCField] = useState(props.form);
    const sync = () => {
        if (props.meta.type === 'section') {
            setCField({ ...props.form });
        }
        props.sync();
    }
    if (cField && cField.display === false) {
        return (<Fragment></Fragment>);
    }
    if (isStandalone || isSection) {
        const wrapClassName = isSection ? 'row section' : isStandalone ? 'col-md-12' : '';
        return (
            <div className={wrapClassName}>
                <RenderColumn cssClassName={cssClassName} props={props} isStandAlone={isStandalone} isSection={isSection} sync={sync} cField={cField} />
            </div>
        )
    } else {
        return <RenderColumn cssClassName={cssClassName} props={props} isStandAlone={isStandalone} isSection={false} sync={sync} cField={cField} />
    }
}

function RenderColumn({ cssClassName, props, isStandAlone, isSection, cField, sync }:
    { cssClassName: string, props: IRenderField, isStandAlone: boolean, isSection: boolean, cField: any, sync: Function }) {
    const { theme } = useContext(FormContext);
    const vs = FormUtils.getVerticalSpacing(theme.type);
    const type = props.meta?.type ? props.meta.type : 'field';
    const wrapClassName = cssClassName ? cssClassName : type === 'field' ? 'col-md-12' : '';
    if (wrapClassName) {
        return (
            <Row isStandalone={isStandAlone} align={props?.meta?.displayProps?.align}>
                {props.meta.displayProps?.rs && <div className="col-md-12"></div>}
                <div className={wrapClassName + ' ' + vs}>
                    {
                        isSection && props.meta.displayType === 'title' && <h4 className="text-center mt-md-5 mb-md-2 mt-4 mb-2">{props.meta.displayName}</h4>
                    }
                    {!isSection && <FormControl props={props} theme={theme.type} cField={cField} sync={sync} />}
                    {
                        props.fields && props.fields.map((field: IField) => <FormFieldRenderer
                            {...field}
                            key={field.name}
                            section={props.section}
                            form={props.form[field.name]}
                            sync={sync}
                        />)
                    }
                </div>
            </Row>
        )
    } else {
        return (
            <Fragment>
                {
                    isSection && props.meta.displayType === 'title' && <Col type="12"><h4 className="text-center mt-md-5 mb-md-2 mt-4 mb-2">{props.meta.displayName}</h4></Col>
                }
                {!isSection && <FormControl props={props} theme={theme.type} cField={cField} sync={sync} />}
                {
                    props.fields && props.fields.map((field: IField) => <FormFieldRenderer {...field}
                        key={field.name}
                        section={props.name}
                        form={props.form[field.name]}
                        sync={sync}
                    />)
                }
            </Fragment>

        )
    }
}