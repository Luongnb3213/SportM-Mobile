// components/Pagination.tsx
import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

type PaginationProps = {
  page: number;               // trang hiện tại (1-based)
  count: number;              // tổng số trang
  onChange: (page: number) => void;
  boundaryCount?: number;     // số nút ở 2 biên (mặc định 1)
  siblingCount?: number;      // số nút 2 bên trang hiện tại (mặc định 1)
  showPrevNext?: boolean;     // có hiện prev/next không
  padLength?: number;         // padding số, vd 2 => 01, 02 (mặc định 2)
  className?: string;
};

type Item = number | 'start-ellipsis' | 'end-ellipsis';

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function Pagination({
  page,
  count,
  onChange,
  boundaryCount = 1,
  siblingCount = 1,
  showPrevNext = true,
  padLength = 2,
  className,
}: PaginationProps) {
  const items: Item[] = useMemo(() => {
    const startPages = range(1, Math.min(boundaryCount, count));
    const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

    const leftSiblingStart = Math.max(
      Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
      boundaryCount + 2
    );
    const rightSiblingEnd = Math.min(
      Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
      endPages.length > 0 ? endPages[0] - 2 : count - 1
    );

    const middlePages =
      leftSiblingStart > rightSiblingEnd
        ? []
        : range(leftSiblingStart, rightSiblingEnd);

    const res: Item[] = [...startPages];

    if (leftSiblingStart > boundaryCount + 2) {
      res.push('start-ellipsis');
    } else if (boundaryCount + 1 < count - boundaryCount) {
      res.push(boundaryCount + 1);
    }

    res.push(...middlePages);

    if (rightSiblingEnd < count - boundaryCount - 1) {
      res.push('end-ellipsis');
    } else if (count - boundaryCount > boundaryCount) {
      res.push(count - boundaryCount);
    }

    res.push(...endPages);
    return res;
  }, [page, count, boundaryCount, siblingCount]);

  const fmt = (n: number) => String(n).padStart(padLength, '0');

  const Btn = ({
    active,
    disabled,
    label,
    onPress,
  }: { active?: boolean; disabled?: boolean; label: string; onPress?: () => void }) => (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={[
        'h-9 min-w-9 px-2 rounded-sm border items-center justify-center mx-1',
        active ? 'border-black bg-white' : 'border-black/15 bg-black/5',
        disabled ? 'opacity-40' : '',
      ].join(' ')}
      style={{ paddingHorizontal: 12 }}
    >
      <Text className={active ? 'text-black font-semibold' : 'text-black/60 font-medium'}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View className={['flex-row items-center', className || ''].join(' ')}>
      {showPrevNext && (
        <Btn
          label="‹"
          disabled={page <= 1}
          onPress={() => onChange(Math.max(1, page - 1))}
        />
      )}

      {items.map((it, idx) => {
        if (it === 'start-ellipsis' || it === 'end-ellipsis') {
          return <Btn key={`${it}-${idx}`} label="…" disabled />;
        }
        const p = it as number;
        return (
          <Btn
            key={p}
            label={fmt(p)}
            active={p === page}
            onPress={() => onChange(p)}
          />
        );
      })}

      {showPrevNext && (
        <Btn
          label="›"
          disabled={page >= count}
          onPress={() => onChange(Math.min(count, page + 1))}
        />
      )}
    </View>
  );
}
