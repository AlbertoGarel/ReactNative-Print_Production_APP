import * as SQLite from 'expo-sqlite';
import {Asset} from "expo-asset";

const FileSystem = require("expo-file-system");
const fileDB2 = require("../www/prepopulated_bobinas.db");

/**
 * @fileoverview Actions for CRUD db
 *
 * @author Albertogarel
 * @version 0.1
 */

/**
 *  Open database SQlite
 *
 *  @return
 *  @param pathToDatabaseFile: string
 * */

export async function openDatabase(pathToDatabaseFile: fileDB2): SQLite.WebSQLDatabase {
    if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
    }
    await FileSystem.downloadAsync(
        Asset.fromModule(fileDB2).uri,
        FileSystem.documentDirectory + 'SQLite/bobinas.db'
    );
    return SQLite.openDatabase('bobinas.db');// READ ONLY (copy)
    // return SQLite.openDatabase(FileSystem.documentDirectory + 'SQLite/bobinas.db');//READ AND WRITE
}

/**
 *  MEDITION_STYLE
 */
export const medition_style_table_ALL =
    "SELECT medition_id AS 'id', " +
    "medition_type AS 'Tipo De Medición', " +
    "full_value AS 'Valor entera', " +
    "media_value AS 'Valor media', " +
    "gramaje_value AS 'Gramaje' " +
    "FROM medition_style_table, gramaje_table " +
    "WHERE gramaje_fk = gramaje_id " +
    "ORDER BY medition_id ASC"
;
export const picker_medition_style =
    "SELECT medition_id, " +
    "medition_type, " +
    "full_value, " +
    "media_value, " +
    "gramaje_value " +
    "FROM medition_style_table, gramaje_table " +
    "WHERE gramaje_fk = gramaje_id " +
    "ORDER BY medition_id ASC"
;
export const meditionStyleByID =
    "SELECT " + "*" + " FROM medition_style_table WHERE medition_style_table.medition_id = ?;"
;
export const updateMeditionStyleByID =
    "UPDATE medition_style_table " +
    "SET medition_type = ?," +
    "full_value = ?," +
    "gramaje_fk = ?," +
    "media_value = ? " +
    "WHERE medition_id = ? ;"
;
//row order: meditionid(ai), medition_type, full_value, gramaje_fk, media_value
export const insertMeditionStyle =
    "INSERT INTO" + " medition_style_table " +
    "VALUES (?, ?, ?, ?, ? );"
;
export const deleteMeditionStyle =
    "DELETE FROM medition_style_table WHERE medition_id = ?;"
/**
 *  COEFICIENTE_TABLE ALL
 */
export const coeficiente_table_ALL =
    "SELECT coeficiente_id AS 'id', " +
    "medida AS 'Valor radio', " +
    "coeficiente_value AS 'Valor' " +
    "FROM coeficiente_table " +
    "ORDER BY coeficiente_id ASC"
;
export const coeficienteSearchValue =
    "SELECT coeficiente_value " +
    "FROM coeficiente_table " +
    "WHERE medida = ?"
;
/**
 *  PAGINACION_TABLE ALL
 */
export const pagination_table_ALL =
    "SELECT paginacion_id AS 'id', " +
    "paginacion_value AS 'Valor' " +
    "FROM paginacion_table " +
    "ORDER BY paginacion_id ASC"
;
export const picker_pagination = "SELECT * FROM paginacion_table"
export const paginationByID =
    "SELECT paginacion_value " +
    "FROM paginacion_table " +
    "WHERE paginacion_id = ?;"
;
export const updatePaginationByID =
    "UPDATE paginacion_table " +
    "SET paginacion_value = ? " +
    "WHERE paginacion_id = ?;"
;
export const insertPagination =
    "INSERT INTO" + " paginacion_table " +
    "VALUES (?,?);"
;
export const deletePaginationByID =
    "DELETE FROM" +
    " paginacion_table " +
    "WHERE paginacion_id = ?"
/**
 *  GRAMAJE_TABLE ALL
 */
export const gramaje_table_ALL =
    "SELECT gramaje_id AS 'id', " +
    "gramaje_value AS 'Valor' " +
    "FROM gramaje_table " +
    "ORDER BY gramaje_id ASC"
;
export const picker_gramaje =
    "SELECT * FROM gramaje_table;"
;
export const gramajeByID =
    "SELECT gramaje_value FROM gramaje_table WHERE gramaje_id = ?;"
;
export const updategramajeByID =
    "UPDATE gramaje_table SET gramaje_value = ? WHERE gramaje_id = ?;"
;
export const insertGramaje =
    "INSERT INTO gramaje_table VALUES (?, ?);"
;
export const deleteGramajeByID =
    "DELETE FROM gramaje_table WHERE gramaje_id = ?;"
;
/**
 *  LINEA_PRODUCCION_TABLE ALL
 */
export const linea_produccion_table_ALL =
    "SELECT linea_id AS 'id', " +
    "linea_name AS 'Nombre de Línea' " +
    "FROM linea_produccion_table " +
    "ORDER BY linea_id ASC;"
;
export const linProdByID =
    "SELECT linea_name FROM linea_produccion_table WHERE linea_id = ?;"
;
export const updateLinProdByID =
    "UPDATE linea_produccion_table SET linea_name = ? WHERE linea_id = ?;"
;
export const insertLinProd =
    "INSERT INTO linea_produccion_table VALUES (?, ?);"
;
export const deleteLinProdByID =
    "DELETE FROM linea_produccion_table WHERE linea_id = ?;"
;
export const pickerLinProd =
    `SELECT * FROM linea_produccion_table`
/**
 *  PAPEL_COMUN_TABLE ALL (propietarios)
 */
export const papel_comun_table_ALL =
    "SELECT papel_comun_id AS 'id', " +
    "papel_comun_name AS 'Nombre' " +
    "FROM papel_comun_table " +
    "ORDER BY papel_comun_id ASC;"
;
export const papelComunByID =
    "SELECT papel_comun_name FROM papel_comun_table WHERE papel_comun_id = ?;"
;
export const insertPapelcomun =
    "INSERT INTO papel_comun_table VALUES (?, ?);"
;
export const updatePapelComunByID =
    "UPDATE papel_comun_table SET papel_comun_name = ? WHERE papel_comun_id = ?;"
;
export const deletePapelComunByID =
    "DELETE FROM papel_comun_table WHERE papel_comun_id = ?;"
;
export const pickerPapelcomun =
    "SELECT * FROM papel_comun_table;"
;
/**
 *  KBA_TABLE ALL
 */
export const kba_table_ALL =
    "SELECT kba_table.kba_id As 'id'," +
    "kba_table.kba_name AS 'Nombre'," +
    "kba_table.kba_value AS 'Valor'," +
    "gramaje_table.gramaje_value As 'Gramaje' " +
    "FROM kba_table " +
    "LEFT JOIN gramaje_table " +
    "ON gramaje_table.gramaje_id = kba_table.gramaje_fk " +
    "ORDER BY kba_table.gramaje_fk ASC"
;
export const kbaByID =
    "SELECT * FROM kba_table WHERE kba_id = ?;"
;
export const insertKba =
    "INSERT INTO kba_table VALUES (?, ?, ?, ?);"
;
export const updateKbaByID =
    "UPDATE kba_table SET kba_name = ?, kba_value = ?, gramaje_fk = ? WHERE kba_id = ?"
;
export const deleteKbaByID =
    "DELETE FROM kba_table WHERE kba_id = ?;"
;
export const pickerKBA =
    "SELECT * FROM kba_table;"
;
/**
 *  AUTOPASTER_TABLE ALL
 */
export const autopaster_table_ALL =
    "SELECT linea_produccion_table.produccion_id As 'id'," +
    "autopaster_table.name_autopaster AS 'Nombre'," +
    "linea_produccion_table.linea_name AS 'Nombre de Línea'," +
    "Case autopaster_table.media When 0 Then 'Entera' Else 'Media' End AS 'Tipo de Bobina' " +
    "FROM autopaster_table " +
    "LEFT JOIN linea_produccion_table " +
    "ON linea_produccion_table.linea_id = autopaster_table.linea_fk " +
    "ORDER BY autopaster_table.linea_fk ASC"
;
export const pickerLineaProd =
    "SELECT * FROM linea_produccion_table;"
;
export const autopasterByID =
    "SELECT * FROM autopaster_table WHERE autopaster_id = ?;"
;
export const insertaAutopasterByID =
    "INSERT INTO autopaster_table VALUES (?, ?, ?, ?);"
;
export const updateAutoasterByID =
    "UPDATE autopaster_table " +
    "SET name_autopaster = ?," +
    "linea_fk = ?," +
    "media = ? " +
    "WHERE autopaster_id = ?;"
;
export const deleteAutopasterByID =
    "DELETE FROM autopaster_table WHERE autopaster_id = ?;"
;
export const getAutopasterByLineaID =
    "SELECT * FROM autopaster_table WHERE autopaster_table.linea_fk = ?;"
/**
 *  PRODUCTO_TABLE ALL
 */
export const producto_table_ALL =
    "SELECT producto_table.producto_id AS 'id'," +
    "producto_table.producto_name AS 'Nombre'," +
    "kba_table.kba_value AS 'Valor'," +
    "papel_comun_table.papel_comun_name AS 'propietario bobina' " +
    "FROM producto_table " +
    "LEFT JOIN kba_table ON kba_table.kba_id = producto_table.cociente_total_fk " +
    "LEFT JOIN papel_comun_table ON papel_comun_table.papel_comun_id = producto_table.papel_comun_fk;"
;
export const picker_producto =
    "SELECT producto_table.producto_id," +
    "producto_table.producto_name," +
    "kba_table.kba_value," +
    "papel_comun_table.papel_comun_name " +
    "FROM producto_table " +
    "LEFT JOIN kba_table ON kba_table.kba_id = producto_table.cociente_total_fk " +
    "LEFT JOIN papel_comun_table ON papel_comun_table.papel_comun_id = producto_table.papel_comun_fk;"
;
export const insertProducto =
    "INSERT INTO producto_table VALUES (?, ?, ?, ?);"
;
export const updateProductoByID =
    "UPDATE producto_table SET producto_name = ?, cociente_total_fk = ?,papel_comun_fk = ? WHERE producto_id = ?;"
;
export const deleteProductoByID =
    "DELETE FROM producto_table WHERE producto_id = ?;"
;
export const produtoByID =
    "SELECT * FROM producto_table WHERE producto_id = ?;"
;
/**
 *  BOBINA_TABLE ALL
 */
export const bobina_table_ALL =
    "SELECT bobina_table.codigo_bobina AS 'código bobina'," +
    "autopaster_table.name_autopaster AS 'Autopaster'," +
    "linea_produccion_table.linea_name AS 'línea'," +
    "producto_table.producto_name 'Propietario'," +
    "gramaje_table.gramaje_value AS 'Gramaje'," +
    "bobina_table.peso_ini AS 'Pesoinicial'," +
    "bobina_table.peso_actual AS 'peso Actual'," +
    "bobina_table.radio_actual AS 'Radio'," +
    "bobina_table.ancho AS 'Ancho' " +
    "FROM bobina_table " +
    "LEFT JOIN autopaster_table " +
    "ON autopaster_table.autopaster_id = bobina_table.autopaster_fk " +
    "LEFT JOIN linea_produccion_table " +
    "ON linea_produccion_table.linea_id = autopaster_table.linea_fk " +
    "LEFT JOIN producto_table " +
    "ON producto_table.producto_id = linea_produccion_table.linea_id " +
    "LEFT JOIN gramaje_table " +
    "ON gramaje_table.gramaje_id = bobina_table.gramaje_fk;"
;
export const search_bobina =
    "SELECT bobina_table.codigo_bobina AS 'código bobina'," +
    "autopaster_table.name_autopaster AS 'Autopaster'," +
    "linea_produccion_table.linea_name AS 'línea'," +
    "producto_table.producto_name 'Propietario'," +
    "gramaje_table.gramaje_value AS 'Gramaje'," +
    "bobina_table.peso_ini AS 'Peso inicial'," +
    "bobina_table.peso_actual AS 'Peso actual'," +
    "bobina_table.radio_actual AS 'Radio actual'," +
    "bobina_table.ancho AS 'Ancho' " +
    "FROM bobina_table " +
    "LEFT JOIN autopaster_table " +
    "ON autopaster_table.autopaster_id = bobina_table.autopaster_fk " +
    "LEFT JOIN linea_produccion_table " +
    "ON linea_produccion_table.linea_id = autopaster_table.linea_fk " +
    "LEFT JOIN producto_table " +
    "ON producto_table.producto_id = linea_produccion_table.linea_id " +
    "LEFT JOIN gramaje_table " +
    "ON gramaje_table.gramaje_id = bobina_table.gramaje_fk " +
    "WHERE " +
    "bobina_table.codigo_bobina LIKE ? OR " +
    "autopaster_table.name_autopaster LIKE ? OR " +
    "linea_produccion_table.linea_name LIKE ? OR " +
    "producto_table.producto_name LIKE ? OR " +
    "gramaje_table.gramaje_value LIKE ? OR " +
    "bobina_table.peso_ini LIKE ? OR " +
    "bobina_table.peso_actual LIKE ? OR " +
    "bobina_table.radio_actual LIKE ?;"

;
export const search_bobina_fullWeight =
    "SELECT bobina_table.codigo_bobina AS 'código bobina'," +
    "autopaster_table.name_autopaster AS 'Autopaster'," +
    "linea_produccion_table.linea_name AS 'línea'," +
    "producto_table.producto_name 'Propietario'," +
    "gramaje_table.gramaje_value AS 'Gramaje'," +
    "bobina_table.peso_ini AS 'Peso inicial'," +
    "bobina_table.peso_actual AS 'Peso actual'," +
    "bobina_table.radio_actual AS 'Radio actual' " +
    "FROM bobina_table " +
    "LEFT JOIN autopaster_table " +
    "ON autopaster_table.autopaster_id = bobina_table.autopaster_fk " +
    "LEFT JOIN linea_produccion_table " +
    "ON linea_produccion_table.linea_id = autopaster_table.linea_fk " +
    "LEFT JOIN producto_table " +
    "ON producto_table.producto_id = linea_produccion_table.linea_id " +
    "LEFT JOIN gramaje_table " +
    "ON gramaje_table.gramaje_id = bobina_table.gramaje_fk " +
    "WHERE bobina_table.peso_actual IS NULL " +
    "OR bobina_table.radio_actual IS NULL"
/**
 *  PRODUCCION_TABLE ALL
 */
export const produccion_table_ALL =
    `SELECT produccion_id AS 'id',
    producto_name AS 'producto',
    kba_value AS 'Cociente producto',
    linea_name AS 'Linea produccion' ,
    gramaje_value AS 'Gramaje',
    paginacion_value AS 'Paginacion',
    editions AS 'Ediciones',
    medition_type || ' ' || gramaje_value AS 'Tipo de medicion',
    tirada AS 'Tirada',
    nulls AS 'Nulls',
    date(fecha_produccion) AS 'Fecha de creación'
    FROM produccion_table
    JOIN kba_table
    ON producto_table.cociente_total_fk = kba_table.kba_id
    JOIN linea_produccion_table
    ON linea_produccion_table.linea_id = produccion_table.linea_fk
    JOIN medition_style_table
    ON medition_style_table.medition_id = produccion_table.medition_fk
    JOIN gramaje_table
    ON gramaje_table.gramaje_id = medition_style_table.gramaje_fk
    JOIN paginacion_table
    ON paginacion_table.paginacion_id = produccion_table.pagination_fk
    JOIN producto_table
    ON producto_table.producto_id = produccion_table.producto_fk`
;
/**
 * BARCODES_TABLE
 */
export const barcodes_table_all =
    "SELECT * FROM barcodes_table;"
;
export const barcodesAndroid =
    "SELECT * FROM barcodes_table WHERE barcode_android = 1;"
;
export const barcodesIos =
    "SELECT * FROM barcodes_table WHERE barcode_ios = 1;"
;


// CREATE TABLE "medition_style_table" (
//     "medition_id"	INTEGER NOT NULL,
//     "medition_type"	VARCHAR(50),
//     "full_value"	REAL,
//     "gramaje_fk"	INTEGER,
//     "media_value"	REAL,
//     PRIMARY KEY("medition_id" AUTOINCREMENT),
//     FOREIGN KEY("gramaje_fk") REFERENCES "gramaje_table"("gramaje_id") ON DELETE NO ACTION ON UPDATE NO ACTION
// )

// CREATE TABLE PRODUCTION
// CREATE TABLE "produccion_table" (
//     "produccion_id" INTEGER NOT NULL,
//     "editions" INTEGER,
//     "linea_fk" INTEGER,
//     "medition_fk" INTEGER,
//     "pagination_fk" INTEGER,
//     "producto_fk" INTEGER,
//     "tirada" BIGINT,
//     "nulls" BIGINT,
//     "fecha_produccion" DATE,
//     PRIMARY KEY("produccion_id"),
//     FOREIGN KEY("linea_fk") REFERENCES "linea_produccion_table"("linea_id") ON DELETE NO ACTION ON UPDATE NO ACTION,
//     FOREIGN KEY("medition_fk") REFERENCES "medition_style_table"("medition_id") ON DELETE CASCADE ON UPDATE CASCADE,
//     FOREIGN KEY("pagination_fk") REFERENCES "paginacion_table"("paginacion_id") ON DELETE CASCADE ON UPDATE CASCADE,
//     FOREIGN KEY("producto_fk") REFERENCES "producto_table"("producto_id") ON DELETE CASCADE ON UPDATE CASCADE
// );

// CREATE TABLE "autopasters_prod_data" (
//     "autopasters_prod_data_id" INTEGER NOT NULL,
//     "production_fk"	INTEGER NOT NULL,
//     "autopaster_fk"	INTEGER NOT NULL,
//     "bobina_fk"	INTEGER NOT NULL,
//     "resto_previsto" INTEGER,
//     "media_defined" BOOLEAN NOT NULL,
//     PRIMARY KEY("autopasters_prod_data_id"),
//     FOREIGN KEY("bobina_fk") REFERENCES "bobina_table"("codigo_bobina") ON DELETE CASCADE ON UPDATE CASCADE,
//     FOREIGN KEY("autopaster_fk") REFERENCES "autopaster_table"("autopaster_id") ON DELETE CASCADE ON UPDATE CASCADE,
//     FOREIGN KEY("production_fk") REFERENCES "produccion_table"("produccion_id") ON DELETE CASCADE ON UPDATE CASCADE
// );
//INSERT
// INSERT INTO produccion_table (editions, linea_fk,medition_fk, pagination_fk, producto_fk, tirada, nulls, fecha_produccion)
// VALUES (?,?,?,?,?,?,?,?)

// SELECT
// SELECT editions AS 'Ediciones',
//     linea_name AS 'Linea produccion' ,
//     medition_type AS 'Medicion',
//     gramaje_value AS 'Gramaje',
//     paginacion_value AS 'Paginacion',
//     producto_name AS 'producto',
//     tirada AS 'Tirada',
//     nulls AS 'Nulls',
//     fecha_produccion AS 'Fecha'
// FROM produccion_table
// LEFT JOIN linea_produccion_table
// ON linea_produccion_table.linea_id = produccion_table.linea_fk
// LEFT JOIN medition_style_table
// ON medition_style_table.medition_id = produccion_table.medition_fk
// LEFT JOIN gramaje_table
// ON gramaje_table.gramaje_id = medition_style_table.gramaje_fk
// LEFT JOIN paginacion_table
// ON paginacion_table.paginacion_id = produccion_table.medition_fk
// LEFT JOIN producto_table
// ON producto_table.producto_id = produccion_table.producto_fk