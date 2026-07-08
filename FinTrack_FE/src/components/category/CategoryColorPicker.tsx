import { useState } from "react";
import { Box, Button, Divider, Popover, TextField, Typography } from "@mui/material";
import { HexColorPicker } from "react-colorful";
import { CATEGORY_COLOR_PALETTE, setCategoryColor } from "../../utils/categoryColor";

type Props = {
  categoryId: number;
  color: string;
  onChange: (color: string) => void;
};

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

function CategoryColorPicker({ categoryId, color, onChange }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [customColor, setCustomColor] = useState(color);

  const handleSelect = (next: string) => {
    setCategoryColor(categoryId, next);
    onChange(next);
    setAnchorEl(null);
  };

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setCustomColor(color);
    setAnchorEl(e.currentTarget);
  };

  return (
    <>
      <Box
        onClick={handleOpen}
        title="카테고리 색상 변경"
        sx={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          bgcolor: color,
          border: "2px solid",
          borderColor: "background.paper",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
          cursor: "pointer",
          flexShrink: 0,
        }}
      />
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, width: 216 }}>
          <Typography variant="caption" color="text.disabled" fontWeight={600}>
            팔레트
          </Typography>
          <Box
            sx={{
              mt: 1,
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: 1,
            }}
          >
            {CATEGORY_COLOR_PALETTE.map((c) => (
              <Box
                key={c}
                onClick={() => handleSelect(c)}
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  bgcolor: c,
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor: c === color ? "text.primary" : "transparent",
                }}
              />
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="caption" color="text.disabled" fontWeight={600}>
            직접 선택
          </Typography>
          <Box
            className="category-color-picker"
            sx={{
              mt: 1,
              "& .react-colorful": { width: "100%", height: 140 },
              "& .react-colorful__saturation": { borderRadius: "8px" },
              "& .react-colorful__hue": { borderRadius: "6px", marginTop: "10px", height: 14 },
              "& .react-colorful__saturation-pointer, & .react-colorful__hue-pointer": {
                width: 16,
                height: 16,
              },
            }}
          >
            <HexColorPicker color={customColor} onChange={setCustomColor} />
          </Box>

          <Box display="flex" gap={1} mt={1.5}>
            <TextField
              size="small"
              value={customColor}
              onChange={(e) => {
                const v = e.target.value;
                setCustomColor(v.startsWith("#") ? v : `#${v}`);
              }}
              sx={{ flex: 1, "& input": { fontSize: 13 } }}
            />
            <Button
              size="small"
              variant="contained"
              disableElevation
              disabled={!HEX_PATTERN.test(customColor)}
              onClick={() => handleSelect(customColor)}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              적용
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}

export default CategoryColorPicker;
