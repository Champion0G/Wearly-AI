import{C as e,j as s}from"./index-cPf8uUct.js";import{b as i}from"./vendor-CY12d32z.js";function t(){const{cart:t,removeFromCart:a,updateQuantity:c}=i.useContext(e),n=t.reduce(((e,s)=>e+s.price*s.quantity),0);return s.jsxs("div",{className:"cart-page",children:[s.jsx("h1",{children:"Shopping Cart"}),0===t.length?s.jsx("p",{children:"Your cart is empty"}):s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"cart-items",children:t.map((e=>s.jsxs("div",{className:"cart-item",children:[s.jsx("img",{src:e.image,alt:e.name}),s.jsxs("div",{className:"item-details",children:[s.jsx("h3",{children:e.name}),e.size&&s.jsxs("p",{children:["Size: ",e.size]}),s.jsxs("p",{children:["Price: $",e.price]}),s.jsxs("div",{className:"quantity-controls",children:[s.jsx("button",{onClick:()=>c(e.id,e.quantity-1),children:"-"}),s.jsx("span",{children:e.quantity}),s.jsx("button",{onClick:()=>c(e.id,e.quantity+1),children:"+"})]}),s.jsx("button",{onClick:()=>a(e.id),className:"remove-btn",children:"Remove"})]})]},e.id)))}),s.jsxs("div",{className:"cart-summary",children:[s.jsxs("h2",{children:["Total: $",n.toFixed(2)]}),s.jsx("button",{className:"checkout-btn",children:"Proceed to Checkout"})]})]})]})}export{t as default};
