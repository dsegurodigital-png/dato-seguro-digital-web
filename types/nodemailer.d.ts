// Shim temporal: nodemailer no incluye tipos propios y @types/nodemailer no
// pudo instalarse en este entorno. Declarar el módulo evita errores de
// compilación; la API se sigue llamando igual, solo sin autocompletado/tipos
// estrictos. Puede eliminarse si en algún momento se instala @types/nodemailer.
declare module "nodemailer";
