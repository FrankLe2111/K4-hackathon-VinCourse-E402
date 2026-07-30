# Visual Style Guide

File nay chot cach ap dung `www.hellochinese.cc-DESIGN.md` cho VinCourse.

## 1. Tinh Cach Giao Dien

VinCourse nen co cam giac:

- Vui, sang, tich cuc.
- Giong game hoc tap hon la dashboard quan tri kho.
- Than thien voi hoc vien yeu, khong lam sai tro nen dang so.
- Du tin cay voi giang vien bang provenance, review status va analytics ro rang.

Mot cau mo ta giao dien:

> Mot ban do hoc tap day mau sac, noi moi concept la mot dia diem, moi loi sai la mot mission co the sua, va moi thanh tich deu co bang chung hoc that.

## 2. Color Tokens

### Mau chinh

- Primary green: `#00CA72`
- Primary green hover: `#00B85F`
- Secondary teal: `#00C898`
- Interactive blue: `#007AFF`

### Mau text

- Primary text: `#222222`
- Secondary text: `#444444`
- Tertiary text: `#888888`
- Border: `#E5E7EB`
- Off white: `#F6F6F6`

### Mau surface

- Cream: `#FFF9E5`
- Light blue: `#E3F9FF`
- Mint: `#DFFFF3`
- Lavender: `#F3F2FF`
- Pink: `#FFE7F4`
- White: `#FFFFFF`

### Semantic mapping cho VinCourse

| Meaning | Color |
| --- | --- |
| Primary action | `#00CA72` |
| Available quest | `#00CA72` |
| Secondary action | `#007AFF` |
| Completed concept | `#00CA72` |
| Locked concept | `#E5E7EB` |
| Error recovery | `#FFE7F4` |
| Daily recall | `#E3F9FF` |
| Story quest | `#FFF9E5` |
| Lab arena | `#F3F2FF` |
| AI adversary | `#DFFFF3` |
| Warning / misconception | Pink surface with dark text |

## 3. Typography

Dung Poppins cho:

- H1, H2, H3.
- Quest title.
- Game mode title.
- Big stat number.
- Reward text.

Dung system sans cho:

- Navigation.
- Labels.
- Metadata.
- Table.
- Form control.

### Scale de xuat trong app

| Role | Size | Weight | Use |
| --- | --- | --- | --- |
| Page title | 32px | 700 | Dashboard, builder, map |
| Mode title | 32px | 700 | Game mode intro |
| Card title | 24px | 600 | Quest card, concept card |
| Section title | 20px | 600 | Panel title |
| Body | 16px | 400 | Noi dung chinh |
| Metadata | 14px | 400/500 | Source, status, tags |
| Badge | 12px | 500 | Bloom level, difficulty |

Khong dung display 128px trong app chinh vi day khong phai landing page marketing. Neu co role selection hero, chi nen dung 48-64px.

## 4. Border Radius

Design system goc co card `60px`. Ap dung co chon loc:

- Hero/game world panel: `48px` hoac `60px`.
- Large mode card: `32px`.
- Quest card: `24px`.
- Answer option: `16px`.
- Input/button: `8px`.
- Badge: `20px`.

## 5. Spacing

Dung he 4px:

- Page padding desktop: `32px`.
- Page padding tablet: `20px`.
- Page padding mobile: `16px`.
- Card padding: `24px` hoac `32px`.
- Gap giua card: `24px` hoac `32px`.
- Major section gap: `48px`.
- Inline gap: `8px` hoac `12px`.

## 6. Navigation

Header cao `64px`, nen trang, border bottom `#E5E7EB`.

Header role admin:

- Logo `VinCourse Admin`
- Course selector
- Link `Courses`, `Review`, `Analytics`
- Button `Preview as Student`

Header role student:

- Logo `VinCourse`
- Link `Map`, `Modes`, `Review`, `Mastery`
- XP chip
- Streak chip
- Avatar

## 7. Buttons

Primary button:

- Background `#00CA72`
- Text white
- Radius `8px`
- Padding `12px 24px`

Secondary button:

- Background `rgba(0, 202, 114, 0.1)`
- Border `1px solid #00CA72`
- Text `#00CA72`

Danger/Reject button:

- Nen dung outline neutral hoac pink surface.
- Khong dung do qua manh tru khi xoa destructive.

## 8. Cards

Large playful cards:

- Background pastel.
- Radius `32px-60px`.
- Padding `32px`.
- No heavy shadow.

Operational cards:

- White background.
- Border `1px solid #E5E7EB`.
- Radius `8px-16px`.
- Padding `20px-24px`.

## 9. Game Map Visual

Khong can ve ban do phuc tap. Co the dung:

- Full-width pastel panel.
- Node tron/luc giac bo tron.
- Path noi cac node bang duong cong hoac duong cham.
- Zone background mau khac nhau.
- Node state:
  - Completed: green fill, check icon.
  - Available: white fill, green border, glow nhe.
  - Recommended: blue border hoac small label.
  - Error recovery: pink fill.
  - Locked: gray fill.

## 10. Accessibility

- Text tren pastel phai dung `#222222`.
- Button xanh voi text trang dat contrast du.
- Touch target toi thieu 44px.
- Selected answer phai co ca border va icon, khong chi dung mau.
- Wrong answer khong chi dung red; them label `Needs review`.
- Progress, XP, mastery phai co text number.

## 11. Do And Don't Rieng Cho VinCourse

### Do

- Dung pastel de tach mode choi.
- Dung green cho hanh dong tiep theo.
- Dung source evidence de tang do tin cay.
- Hien thi mastery bang evidence, khong chi phan tram.
- Lam sai tro thanh trang thai co the hanh dong: `Start Recovery`.

### Don't

- Khong bien UI thanh quiz app chi co diem.
- Khong dung leaderboard lam man hinh chinh.
- Khong dung qua nhieu mau trong cung mot panel.
- Khong show loi giai day du ngay khi sai lan dau.
- Khong de admin UI qua kho khoan nhu enterprise BI.

