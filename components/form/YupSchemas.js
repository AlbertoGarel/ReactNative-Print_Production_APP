import * as Yup from "yup";

export const FormYupSchemas = {
    tirada: Yup.number()
        .min(0, 'Too Short!')
        .max(100000, 'Too Long!')
        .required('Required'),
    editions: Yup.number()
        .min(1, 'Too Short!')
        .max(90, 'Too Long!')
        .required('Required'),
    meditionType: Yup.number()
        .min(1, 'Select a value'),
    inputWeigth: Yup.number()
        .min(1, 'too Short!')
        .max(10000, 'Too Long!')
        .required('required'),
    inputRadio: Yup.number()
        .min(1, 'too Short!')
        .max(1000, 'Too Long!')
        .required('required'),
    inputTirBruta: Yup.number()
        .min(1, 'Too Short!')
        .max(100000, 'Too Long!')
        .required('-- Requerido --'),
    pickerPagination: Yup.number()
        .min(1, 'Select a value'),
    pickerProducto: Yup.number()
        .min(1, 'Select a value'),
    pickerGramaje: Yup.number()
        .min(1, 'Select a value'),
    meditionStyle: Yup.string()
        .matches(/[A-Za-z0-9]+/g, "Must be only digits")
        .required('Required!'),
    fullVal: Yup.number()
        .min(0)
        .max(100)
        .required('Required'),
    medVal: Yup.number()
        .min(0)
        .max(100)
        .required('Required'),
    paginationVal: Yup.number()
        .min(16)
        .max(200)
        .required('Required'),
    gramajeVal: Yup.number()
        .min(0)
        .max(100)
        .required('Required'),
    linProdVal: Yup.string()
        .min(3)
        .max(20)
        .required('Required'),
    intNumb: Yup.number()
        .min(1)
        .max(15)
        .required('Required!'),
    trueFalseBin: Yup.number()
        .min(0, 'select a value')
};
