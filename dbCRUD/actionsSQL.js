import * as SQLite from 'expo-sqlite';
import {Asset} from "expo-asset";

const FileSystem = require("expo-file-system");
const fileDB2 = require("../www/bobinas.db");

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
    return SQLite.openDatabase('bobinas.db');
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
/**
 *  COEFICIENTE_TABLE ALL
 */
export const coeficiente_table_ALL =
    "SELECT coeficiente_id AS 'id', " +
    "coeficiente_value AS 'Valor' " +
    "FROM coeficiente_table " +
    "ORDER BY coeficiente_id ASC"
;
export const coeficienteSearchValue =
    "SELECT coeficiente_value " +
    "FROM coeficiente_table " +
    "WHERE coeficiente_id = ?"
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
/**
 *  GRAMAJE_TABLE ALL
 */
export const gramaje_table_ALL =
    "SELECT gramaje_id AS 'id', " +
    "gramaje_value AS 'Valor' " +
    "FROM gramaje_table " +
    "ORDER BY gramaje_id ASC"
;
/**
 *  LINEA_PRODUCCION_TABLE ALL
 */
export const linea_produccion_table_ALL =
    "SELECT linea_id AS 'id', " +
    "linea_name AS 'Nombre de Línea' " +
    "FROM linea_produccion_table " +
    "ORDER BY linea_id ASC"
;
/**
 *  PAPEL_COMUN_TABLE ALL
 */
export const papel_comun_table_ALL =
    "SELECT papel_comun_id AS 'id', " +
    "papel_comun_name AS 'Nombre' " +
    "FROM papel_comun_table " +
    "ORDER BY papel_comun_id ASC"
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
/**
 *  AUTOPASTER_TABLE ALL
 */
export const autopaster_table_ALL =
    "SELECT autopaster_table.autopaster_id As 'id'," +
    "autopaster_table.name_autopaster AS 'Nombre'," +
    "autopaster_table.autopaster_prefered AS 'Preferencia de Uso'," +
    "linea_produccion_table.linea_name AS 'Nombre de Línea'," +
    "Case autopaster_table.media When 0 Then 'Entera' Else 'Media' End AS 'Tipo de Bobina' " +
    "FROM autopaster_table " +
    "LEFT JOIN linea_produccion_table " +
    "ON linea_produccion_table.linea_id = autopaster_table.linea_fk " +
    "ORDER BY autopaster_table.linea_fk ASC"
;
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
    "bobina_table.radio_actual AS 'Radio' " +
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
/**
 *  PRODUCCION_TABLE ALL
 */
export const produccion_table_ALL = "SELECT * FROM produccion_table "
;
