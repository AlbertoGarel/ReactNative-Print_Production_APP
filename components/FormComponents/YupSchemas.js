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
        .matches(/[A-Za-z0-9]+/g, "Sólo letras y dígitos")
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
        .min(0, 'select a value'),
    onlyLeters: Yup.string()
        .matches(/[A-Za-z]+/g, "Sólo letras")
        .required('Required!'),
    whitespaceandchars: Yup.string()
        .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g, "Sólo letras y dígitos")
        .required('Required!'),
    onlyNumbersPercentage: Yup.number()
        .min(2, 'valor mnínimo en 2%')
        .required('Required!'),
    onlyNumbersNullCopies: Yup.number()
        .min(10, 'valor mnínimo en 10 ejemplares')
        .required('Required!'),
    pag: Yup.number()
        .min(16, "Paginación mínima de 16")
        .max(200)
        .required('Required'),
    dateReg: Yup.string()
        .matches(/^[0-9]{4}[\/][0-9]{2}[\/][0-9]{2}$/g)
        .required('Required'),
    optionalWeight: Yup.number(),
    weight: Yup.number()
        .max(1000, 'Peso máximo sobrepasado')
        .required('Requerido'),
};
