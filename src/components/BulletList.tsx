import { Bullet } from "../types/slide";

interface Props {
  items: Bullet[];
  style: "dash" | "number";
  depth?: number;
}

export function BulletList({ items, style, depth = 0 }: Props) {
  const Tag = style === "number" && depth === 0 ? "ol" : "ul";
  return (
    <Tag className={`bullets bullets--${style} bullets--depth-${depth}`}>
      {items.map((item, i) => {
        if (typeof item === "string") {
          return (
            <li key={i} className="bullet">
              {item}
            </li>
          );
        }
        return (
          <li key={i} className="bullet">
            <span>{item.text}</span>
            {item.children && <BulletList items={item.children} style="dash" depth={depth + 1} />}
          </li>
        );
      })}
    </Tag>
  );
}
