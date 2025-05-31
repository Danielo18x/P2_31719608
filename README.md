# **Proyecto Repatech**

**Repatech** es una plataforma diseñada para la gestión eficiente de reparaciones tecnológicas, integrando múltiples servicios para mejorar la experiencia del usuario. Esta documentación detalla su configuración e integración con herramientas clave.

## **1. Requisitos Previos**
Antes de iniciar, asegúrate de contar con:
- **Node.js** instalado (`>= v18.0`).
- Un entorno de desarrollo con soporte para **Git** y **npm**.
- Claves de acceso a servicios externos (Google reCAPTCHA, API de pagos, etc.).
- Configuración adecuada de variables de entorno.

## **2. Configuración de Variables de Entorno**
Para garantizar seguridad, las credenciales sensibles deben almacenarse en un archivo `.env`. Crea el archivo en la raíz del proyecto con el siguiente contenido:

```env
EMAIL_USER=tu_correo@repatech.com
EMAIL_PASS=tu_contraseña_o_app_password
PORT=3000
RECAPTCHA_SECRET=tu_clave_secreta_recaptcha
```

⚠ **Importante:** Agregar `.env` al `.gitignore` para evitar exposición en repositorios públicos.

---

## **3. Integración de Servicios**
### **3.1. Google reCAPTCHA**
El formulario de contacto debe estar protegido contra ataques automatizados. Para ello:
1. Registra el dominio en [Google reCAPTCHA](https://www.google.com/recaptcha/about/).
2. Obtén el **site key** y el **secret key**.
3. Agrega el site key en el frontend:

```html
<div class="g-recaptcha" data-sitekey="TU_SITE_KEY"></div>
```

4. Almacena el secret key en `.env` bajo `RECAPTCHA_SECRET`.
5. Implementa la validación en el backend antes de procesar los datos.

### **3.2. Google Analytics**
Para realizar seguimiento del tráfico y comportamiento de los usuarios:
1. Crea una cuenta en [Google Analytics](https://analytics.google.com/analytics/web/).
2. Obtén el **ID de medición**.
3. Agrega el script en el `<head>` de las vistas:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

4. Configura eventos personalizados para rastrear acciones clave dentro de la aplicación.

### **3.3. Notificación por Correo Electrónico**
La plataforma debe enviar notificaciones tras la recepción de formularios. Se usa **Nodemailer**:

#### **Configuración**
1. Instalar Nodemailer:
   ```bash
   npm install nodemailer
   ```
2. Definir credenciales en `.env`.
3. Enviar correos con información clave del usuario:
   - Nombre
   - Correo electrónico
   - Comentario
   - Dirección IP y país
   - Fecha y hora de solicitud

4. Configurar el destino de correos (`alertas@repatech.com`).

### **3.5. API de Pagos Simulados**
Se utiliza [Fake Payment API](https://fakepayment.onrender.com) para la gestión de pagos.

#### **Configuración**
- Enviar solicitud al endpoint `/pay` con los siguientes datos en formato JSON:

```json
{
  "amount": "string",
  "card-number": "string",
  "cvv": "string",
  "expiration-month": "string",
  "expiration-year": "string",
  "full-name": "string",
  "currency": "string",
  "description": "string",
  "reference": "string"
}
```

- Procesar la respuesta de la API para confirmar el estado del pago.

---

## **4. Despliegue y Ejecución**
### **4.1. Instalación de Dependencias**
Ejecutar el siguiente comando:

```bash
npm install
```

### **4.2. Inicio del Servidor**
```bash
npm start
```

### **4.3. Acceso**
Abrir en el navegador:
```plaintext
http://localhost:3000
```

---

## **5. Recomendaciones de Seguridad**
- **No expongas credenciales en el repositorio público.**  
- **Realiza pruebas de integración antes de implementar en producción.**  
- **Configura herramientas de monitoreo y logs para detectar posibles errores.**  

---
