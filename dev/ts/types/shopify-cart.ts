export interface LineItem {
    id: number;
    title: string;
    price: number;
    line_price: number;
    quantity: number;
    sku?: string;
    grams: number;
    vendor: string;
    properties?: { [key: string]: string };
    variant_id: number;
    gift_card: boolean;
    url: string;
    image: string;
    handle: string;
    requires_shipping: boolean;
    product_title: string;
    product_description: string;
    product_type: string;
    variant_title: string;
    variant_options: string[];
}

export interface Cart {
    token: string;
    note: string;
    attributes: { [key: string]: string };
    total_price: number;
    total_weight: number;
    item_count: number;
    requires_shipping: boolean;
    currency: string;
    items: LineItem[];
}