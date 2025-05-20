import "express-session";

declare module "express-session" {
  interface SessionData {
    userId: string;
    user?: {
      id: string;
      name?: string;
      email?: string;
    };
    listingData?: {
      type?: string;
      title?: string;
      description?: string;
      salePrice?: number;
      rentalPrice?: number;
      rentalDuration?: string;
      condition?: string;
      showInOtherAreas?: string;
      delivery?: string;
      payment?: string;
      promote?: string;
      city?: string;
      category?: string;
      categoryId?: number;
      images?: string[];
    };
  }
}
