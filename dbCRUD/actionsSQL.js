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
 *  MEDITION_STYLE_TABLE ALL
 */
export const medition_style_table_ALL =
    "SELECT medition_id AS 'id', " +
    "medition_type AS 'Tipo De Medición', " +
    "medition_value AS 'Valor', " +
    "gramaje_value AS 'Gramaje' " +
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
/**
 *  COEFICIENTE_TABLE ALL
 */
export const pagination_table_ALL =
    "SELECT paginacion_id AS 'id', " +
    "paginacion_value AS 'Valor' " +
    "FROM paginacion_table " +
    "ORDER BY paginacion_id ASC"
;
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
    "SELECT kba_id AS 'id', " +
    "kba_name AS 'Nombre', " +
    "kba_value AS 'Valor', " +
    "gramaje_fk AS 'Gramaje' " +
    "FROM kba_table, gramaje_table " +
    "WHERE gramaje_fk = gramaje_id " +
    "ORDER BY kba_id ASC"
;
/**
 *  AUTOPASTER_TABLE ALL
 */
export const autopaster_table_ALL =
    "SELECT autopaster_id AS 'id', " +
    "name_autopaster AS 'Nombre', " +
    "autopaster_prefered AS 'Preferencia de uso', " +
    "linea_fk AS 'Nombre de Línea', " +
    "media AS 'Tipo de Bobina' " +
    "FROM autopaster_table, linea_produccion_table " +
    "WHERE linea_fk = linea_id " +
    "ORDER BY linea_fk ASC"
;
/**
 *  PRODUCTO_TABLE ALL
 */
export const producto_table_ALL =
    "SELECT producto_id AS 'id', " +
    "producto_name AS 'Nombre de Producto', " +
    "cociente_total_fk AS 'Cociente', " +
    "papel_comun_fk AS 'Propietario' " +
    "FROM producto_table " +
    "INNER JOIN kba_table ON kba_table.kba_id = producto_table.cociente_total_fk " +
    "INNER JOIN papel_comun_table ON papel_comun_table.papel_comun_id = producto_table.papel_comun_fk " +
    "ORDER BY papel_comun_fk ASC"
;
/**
 *  BOBINA_TABLE ALL
 */
export const bobina_table_ALL =
    "SELECT codigo_bobina AS 'Código Bobina', " +
    "peso_ini AS 'Peso Inicial', " +
    "peso_actual AS 'Peso Actual', " +
    "radio_actual AS 'Radio Actual', " +
    "papel_comun_fk AS 'Propietario', " +
    "gramaje_fk AS 'Gramaje', " +
    "autopaster_fk AS 'Autopaster' " +
    "FROM bobina_table " +
    "INNER JOIN papel_comun_table ON papel_comun_table.papel_comun_id = bobina_table.papel_comun_fk " +
    "INNER JOIN gramaje_table ON gramaje_table.gramaje_id = bobina_table.gramaje_fk " +
    "INNER JOIN autopaster_table ON autopaster_table.autopaster_id = bobina_table.autopaster_fk " +
    "ORDER BY papel_comun_fk ASC"
;
/**
 *  PRODUCCION_TABLE ALL
 */
export const produccion_table_ALL =
    "SELECT produccion_id AS 'id', " +
    "product_id AS 'Producto', " +
    "codigo_bobina_fk AS 'Código Bobina', " +
    "ejemplares_tirada AS 'Tirada prevista', " +
    "fecha_produccion AS 'Fecha' " +
    "FROM produccion_table " +
    "INNER JOIN producto_table ON producto_table.producto_id = produccion_table.produccion_id " +
    "INNER JOIN bobina_table ON bobina_table.codigo_bobina = produccion_table.codigo_bobina_fk " +
    "ORDER BY product_id ASC"
;