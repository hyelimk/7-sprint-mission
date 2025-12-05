export class ProductComment {
  constructor(product) {
    this.product = product;
  }
}

export class UnregisteredProduct {
  // id, title, content, createdAt를 조회합니다.
  // 외부에서 쓰지 못한다.
  constructor(name, price, tags, description) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
  }

  static fromInfo({ name, price, tags = [], description }) {
    const info = {
      name,
      price,
      tags,
      description,
    };
    validateUnregisteredProductinfo(info);

    return new UnregisteredProduct(
      info.name,
      info.price,
      info.tags,
      info.description
    );
  }
}

export class Product {
  constructor(id, name, description, price, tags, createdAt, comments = []) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.createdAt = createdAt;
    this.comments = comments;
  }

  static fromEntity({ id, name, description, price, tags = [], created_at }) {
    const info = {
      id: id.toString(),
      name,
      description,
      price,
      tags,
      createdAt: created_at,
    };
    console.log("info fromEntiry:", info);
    validateProductInfo(info);

    return new Product(
      info.id,
      info.name,
      info.description,
      info.price,
      info.tags,
      info.createdAt
    );
  }
}
function isNonNegative(value) {
  return typeof value === "number" && value >= 0;
}

export class UnregisteredProductInfo {
  constructor(name, description, price, tags) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
  }

  static fromInfo({ name, description, price, tags }) {
    const info = {
      name,
      description,
      price,
      tags,
    };
    validateUnregisteredProductinfo(info);
    // 출입국 심사... imigration입니다...

    return new UnregisteredProductInfo(
      info.name,
      info.description,
      info.price,
      info.tags
    );
  }
}

function validateId(id) {
  if (typeof id !== "string") {
    throw new Error(`Invalid id type ${typeof id}}`);
  }
}

function validateName(name) {
  if (!name) throw new Error("Falsy name");
  if (name.length > 100) {
    throw new Error(`name too long ${name.length}`);
  }
}
function validateDescription(description) {
  if (!description) throw new Error("Falsy description");
  if (description.length > 10000) {
    throw new Error(`Content too long ${description.length}`);
  }
}

function validatePrice(price) {
  if (price === null || price === undefined) {
    throw new Error("Price is required and cannot be null or undefined.");
  }
  if (!isNonNegative(price)) {
    throw new Error(`Price cannot be negative: ${price}`);
  }
}

function validateTag(tags) {
  if (!Array.isArray(tags)) {
    throw new Error("Tag 배열로 입력");
  }
}

function validateCreateAt(createat) {
  if (new Date("2024-01-01") > createat) {
    throw new Error(`Invalid createAT ${createat.toString()}`);
  }
}

function validateProductInfo({
  id,
  name,
  description,
  price,
  tags,
  createdAt,
}) {
  validateId(id);
  validateName(name);
  validateDescription(description);
  validatePrice(price);
  validateTag(tags);
  validateCreateAt(createdAt);
}

function validateUnregisteredProductinfo({ name, description, price, tags }) {
  validateName(name);
  validateDescription(description);
  validatePrice(price);
  validateTag(tags);
}
