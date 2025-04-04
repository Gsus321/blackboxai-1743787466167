
Built by https://www.blackbox.ai

---

# Casa Artesanal Mexicana

## Project Overview
Casa Artesanal Mexicana is an online shopping platform that provides users with a rich selection of authentic Mexican handicrafts. Users can easily navigate through products, add items to their cart, and proceed to purchase through a secure checkout process. This project incorporates various functionalities, including user authentication, product management, and a responsive UI designed to enhance user experience.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   ```

2. **Navigate into the project directory**:
   ```bash
   cd casa-artesanales
   ```

3. **Open `index.html` in a web browser**:
   You can simply open the `index.html` file in any modern web browser, or host it locally using a web server.

4. **Make sure you have internet access** to load external resources like SweetAlert2 for notification alerts.

## Usage

1. **Register a new account**: Start by clicking on the 'Registro' link to create a new account. Fill in the required details and select your user type.
2. **Login**: After registering, you can log in through the 'Iniciar Sesión' link.
3. **Browse Products**: Navigate to the 'Comercio' section to view available artisan products.
4. **Add to Cart**: Click the 'Agregar al carrito' button on a product to add it to your shopping cart.
5. **View Cart**: Click the cart icon to view items in your cart and proceed to checkout.
6. **Checkout**: Fill in your payment information and confirm your order.

## Features

- **User Authentication**: Users can register, log in, and log out.
- **Product Management**: Artisans can add and manage their products.
- **Shopping Cart**: Users can add, update, or remove items from their cart.
- **Payment Processing**: Simulated payment processing with form validation.
- **Responsive Design**: Optimized for various screen sizes for better accessibility.

## Dependencies

This project uses the following dependencies:
- [SweetAlert2](https://sweetalert2.github.io/) for alert notifications.
- Basic HTML/CSS for layout and styling.

No third-party libraries are required, apart from standard web technologies.

## Project Structure

Here's an overview of the project structure:

```
├── index.html       # Main entry point
├── comercio.html    # Page for viewing products
├── historia.html     # About page
├── contacto.html     # Contact form page
├── exportaciones.html# Page about exporting crafts
├── login.html       # User login page
├── registro.html    # User registration page
├── catalogo.html    # Product management for sellers
├── estilos.css      # Main styles for the website
├── exportaciones.css # Styles specific to exportations page
├── login.css        # Styles for login page
├── registro.css      # Styles for registration page
├── catalogo.css     # Styles for catalog page
├── carrito.js       # Main shopping cart functionality
├── script.js        # General JavaScript functions
├── registro.js      # Registration-related functionality
```

**Note**: Make sure your HTML files properly link to their respective CSS and JavaScript files for full functionality.

Feel free to modify the project to better meet your needs, and enjoy integrating traditional Mexican culture into the online marketplace!