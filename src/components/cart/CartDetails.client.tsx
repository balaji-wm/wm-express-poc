import { useRef } from "react";
import { useScroll } from "react-use";
import {
  useCart,
  CartLineProvider,
  CartShopPayButton,
  Money,
} from "@shopify/hydrogen";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { Button, Text, CartLineItem, CartEmpty } from "~/components";

export function CartDetails({
  layout,
  onClose,
}: {
  layout: "drawer" | "page";
  onClose?: () => void;
}) {
  const { lines } = useCart();
  const scrollRef = useRef(null);
  const { y } = useScroll(scrollRef);

  if (lines.length === 0) {
    return <CartEmpty onClose={onClose} layout={layout} />;
  }

  const container = {
    drawer: "grid grid-cols-1 h-screen-no-nav grid-rows-[1fr_auto]",
    page: "pb-12 grid md:grid-cols-2 md:items-start gap-8 md:gap-8 lg:gap-12",
  };

  const content = {
    drawer: "px-6 pb-6 sm-max:pt-2 overflow-auto transition md:px-12",
    page: "flex-grow md:translate-y-4",
  };

  const summary = {
    drawer: "grid gap-6 p-6 border-t md:px-12",
    page: "sticky top-nav grid gap-6 p-4 md:px-6 md:translate-y-4 bg-primary/5 rounded w-full",
  };
  const stripePromise = loadStripe(
    "pk_test_51LIdSRSJN1bk4MiKPj546E7UwS5GWcCHpvSJpKj0ctt1NO4XQ26zi0nCSYx94FwOSpZKKcWe86pnoogF4Y2THt6x00XRneJ1uu"
  );
  return (
    <form className={container[layout]}>
      <section
        ref={scrollRef}
        aria-labelledby="cart-contents"
        className={`${content[layout]} ${y > 0 ? "border-t" : ""}`}
      >
        <ul className="grid gap-6 md:gap-10">
          {lines.map((line) => {
            return (
              <CartLineProvider key={line.id} line={line}>
                <CartLineItem />
              </CartLineProvider>
            );
          })}
        </ul>
      </section>
      <section aria-labelledby="summary-heading" className={summary[layout]}>
        <h2 id="summary-heading" className="sr-only">
          Order summary
        </h2>
        <OrderSummary />
        <CartCheckoutActions />
      </section>
    </form>
  );
}

function CartCheckoutActions() {
  const cartData = useCart();
  console.log({ cartData });

  const InitiatePayment = async (event) => {
    
    cartData.buyerIdentityUpdate({
      countryCode: "IN",
      email: "SavvyMechanic@gmail.com",
      phone: "+918790892038"
    })
  };

  return (
    <>
      {cartData.checkoutUrl}
      <div className="grid gap-4">
        <Button
          onClick={InitiatePayment}
          // to={checkoutUrl}
        >
          Checkout
        </Button>
        {/* <CartShopPayButton /> */}
      </div>
    </>
  );
}

function OrderSummary() {
  const { cost } = useCart();
  return (
    <>
      <dl className="grid">
        <div className="flex items-center justify-between font-medium">
          <Text as="dt">Subtotal</Text>
          <Text as="dd">
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              "-"
            )}
          </Text>
        </div>
      </dl>
    </>
  );
}

// const Create_Cart = gql`
//   mutation customerUpdate(
//     $customer: CustomerUpdateInput!
//     $customerAccessToken: String!
//   ) {
//     customerUpdate(
//       customer: $customer
//       customerAccessToken: $customerAccessToken
//     ) {
//       customerUserErrors {
//         code
//         field
//         message
//       }
//     }
//   }
// `;
