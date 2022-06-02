import * as Yup from "yup";

const errorMessages = {
    required: 'Requerido.',
    tooLong: 'Excedido límite permitido',
    tooShort: 'Valor mínimo no válido.',
    tooShortThatZeroValuePicker: 'Realiza una selección válida.',
    tooShortThatZero: 'Introduce un número mayor que cero.'
}

export const FormYupSchemas = {
    tirada: Yup.number()
        .min(0, `${errorMessages.tooShort}`)
        .max(100000, errorMessages.tooLong)
        .required(errorMessages.required),
    editions: Yup.number()
        .min(1, errorMessages.tooShortThatZero)
        .max(90, errorMessages.tooLong)
        .required(errorMessages.required),
    meditionType: Yup.number()
        .min(1, errorMessages.tooShortThatZero),
    inputWeigth: Yup.number()
        .min(1, errorMessages.tooShortThatZero)
        .max(10000, errorMessages.tooLong)
        .required(errorMessages.required),
    inputRadio: Yup.number()
        .min(1, errorMessages.tooShortThatZero)
        .max(1000, errorMessages.tooLong)
        .required(errorMessages.required),
    inputTirBruta: Yup.number()
        .min(1, errorMessages.tooShortThatZero)
        .max(100000, errorMessages.tooLong)
        .required(`-- ${errorMessages.required} --`),
    pickerPagination: Yup.number()
        .min(1, errorMessages.tooShortThatZeroValuePicker),
    pickerProducto: Yup.number()
        .min(1, errorMessages.tooShortThatZeroValuePicker),
    pickerGramaje: Yup.number()
        .min(1, errorMessages.tooShortThatZeroValuePicker),
    meditionStyle: Yup.string()
        .matches(/[A-Za-z0-9]+/g, "Sólo letras y dígitos")
        .required(errorMessages.required),
    fullVal: Yup.number()
        .min(0, errorMessages.tooShort)
        .max(100, errorMessages.tooLong)
        .required(errorMessages.required),
    medVal: Yup.number()
        .min(0, errorMessages.tooShort)
        .max(100, errorMessages.tooLong)
        .required(errorMessages.required),
    paginationVal: Yup.number()
        .min(16, 'Paginción mínima en 16')
        .max(200, errorMessages.tooLong)
        .required(errorMessages.required),
    gramajeVal: Yup.number()
        .min(0, errorMessages.tooShort)
        .max(100, errorMessages.tooLong)
        .required(errorMessages.required),
    linProdVal: Yup.string()
        .min(3, errorMessages.tooShort)
        .max(20, errorMessages.tooLong)
        .required(errorMessages.required),
    intNumb: Yup.number()
        .min(1, errorMessages.tooShortThatZero)
        .max(15, errorMessages.tooLong)
        .required(errorMessages.required),
    trueFalseBin: Yup.number()
        .min(0, errorMessages.tooShort),
    onlyLeters: Yup.string()
        .matches(/[A-Za-z]+/g, "Sólo letras")
        .required(errorMessages.required),
    whitespaceandchars: Yup.string()
        .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g, "Sólo letras y dígitos")
        .required(errorMessages.required),
    onlyNumbersPercentage: Yup.number()
        .min(2, 'Valor mnínimo en 2%')
        .required(errorMessages.required),
    onlyNumbersNullCopies: Yup.number()
        .min(10, 'Valor mnínimo en 10 ejemplares')
        .required(errorMessages.required),
    pag: Yup.number()
        .min(16, "Paginación mínima de 16")
        .max(200, errorMessages.tooLong)
        .required(errorMessages.required),
    dateReg: Yup.string()
        .matches(/^[0-9]{4}[\/][0-9]{2}[\/][0-9]{2}$/g, 'Formato requerido YYMMDD')
        .required(errorMessages.required),
    optionalWeight: Yup.number(),
    weight: Yup.number()
        .max(1000, errorMessages.tooLong)
        .required(errorMessages.required),
    customNumber: Yup.number(),
    customBoolean: Yup.boolean(),
    email: Yup.string().email('Formato email incorrecto.').required(errorMessages.required),
    date: Yup.string().required(errorMessages.required)
};
