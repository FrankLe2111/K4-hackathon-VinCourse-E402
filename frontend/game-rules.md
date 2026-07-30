# VinCourse Game Rules

## Tong quan

VinCourse la mot learning game cho nguoi hoc moi bat dau voi AI va Machine Learning. Nguoi choi khong chi "tra loi dung" de lay diem, ma phai tao du minh chung hoc tap: nho lai duoc, giai thich duoc, sua duoc hieu lam, van dung vao code va chuyen kien thuc sang tinh huong moi.

Frontend hien tai co 6 game mode chinh trong man `Game Modes`:

1. Story Quest
2. Daily Recall
3. Error Dungeon
4. Lab Arena
5. Boss Battle
6. Live Class Battle

Ngoai ra, sidebar co mode MVP rieng la `Hieu That`, dung AI checkpoint de cham cau teach-back dua tren nguon khoa hoc.

## Core Learning Rules

Tat ca game mode dung chung cac luat loi:

- Moi mission phai gan voi mot learning objective ro rang.
- Moi cau hoi phai co source evidence tu bai giang, transcript, slide, lab hoac tai lieu da duyet.
- Sai khong bi phat nang, nhung loi sai se bien thanh recovery mission.
- Mastery khong chi dua tren quiz score; mastery can evidence tu recall, explanation, transfer va application.
- Do tu tin cua nguoi choi duoc ghi nhan de calibration, nhung khong thay the do dung cua cau tra loi.
- AI khong duoc tu do sang tao kien thuc ngoai nguon.
- Nguoi choi luon co next action: thu lai, xem nguon, vao recovery, on tap, lab, boss hoac mo zone moi.

## 1. Story Quest

### Muc tieu

Story Quest la che do chinh de nguoi hoc non-tech di qua ban do khoa hoc nhu mot hanh trinh. Nguoi choi vao vai mot `Student Explorer`, bat dau tu cac khai niem AI co ban va dan mo khoa cac vung nhu `Data Village`, `Gradient Forest`, `Evaluation Arena`.

### Core Loop

1. Nguoi choi chon mot node tren Course Map.
2. Game dua ra boi canh cau chuyen va mot van de can giai quyet.
3. Nguoi choi tra loi quiz hoac nhiem vu ngan.
4. He thong cham theo dap an, do tu tin va reasoning.
5. Neu dung, nguoi choi nhan XP va mo khoa node tiep theo.
6. Neu sai, game hien misconception va dua nguoi choi sang Recovery Mission.

### Rule qua man

- Moi quest co tien do rieng, vi du `2 / 5`.
- Moi quest gom nhieu checkpoint nho.
- Nguoi choi can dat dung checkpoint bat buoc de hoan thanh quest.
- Hoan thanh quest se tang mastery cho concept lien quan.
- Quest quan trong co the mo khoa `Lab Arena`, `Error Dungeon` hoac `Boss Gate`.

### Dang cau hoi trong Story Quest

#### Multiple Choice Quiz

Dung cho cau hoi ly thuyet hoac doc tinh huong ngan.

Rule:

- Moi cau co 4 lua chon A/B/C/D.
- Chi co 1 dap an dung.
- Moi lua chon sai nen dai dien cho mot misconception cu the.
- Nguoi choi phai chon muc tu tin: Low, Medium, High.
- Nut `Check answer` chi bat khi da chon dap an.

Vi du trong frontend:

Question: Mot model co mot feature tu 0-1 va mot feature tu 1-100,000. Training dao dong du da tang epoch. Nen thu cach nao truoc?

Correct answer: `Standardize the feature scales before training`.

Distractors:

- `Increase epochs from 100 to 10,000`: hieu lam rang train lau hon se sua bat on toi uu.
- `Remove the smaller-valued feature`: hieu lam rang feature nho gay van de.
- `Increase the learning rate to converge faster`: hieu lam rang learning rate cao hon luon tot hon.

#### Fill-in-Code Quiz

Dung cho nguoi hoc moi bat dau, khong bien thanh coding test nang.

Rule:

- Cho mot doan code ngan co mo ta.
- Chi de trong 1-3 vi tri quan trong.
- Moi bai chi test mot concept.
- Chap nhan dap an dung ve y tuong neu syntax loi nhe.
- Neu sai logic, dua sang feedback va recovery.

Vi du:

```python
def standardize(X):
    mean = np.mean(X, axis=0)
    std = np.std(X, axis=0)
    return (X - ___) / ___
```

Expected: nguoi choi dien `mean` va `std`, sau do giai thich rang standardization dua feature ve cung scale de gradient descent on dinh hon.

### Scoring

- Dung lan dau: full XP.
- Dung sau hint: giam XP nhe.
- Sai: khong cong XP, tao recovery mission.
- Sai nhung sua duoc: cong recovery bonus.

## 2. Daily Recall

### Muc tieu

Daily Recall la che do on tap ngan moi ngay, dua tren spaced repetition. No giup nguoi choi nho lai truoc khi kien thuc phai dan.

### Core Loop

1. He thong chon cac concept den han on.
2. Nguoi choi bat dau phien 5 phut.
3. Moi cau hoi yeu cau tra loi nhanh va chon do tu tin.
4. Sau phien, he thong cap nhat lich on tiep theo.
5. Cau sai hoac do tu tin lech se duoc dua vao Error Dungeon.

### Rule chon cau de on

Frontend dang hien 4 ly do chon concept:

- Lan cuoi on cach day 7 ngay.
- Do tu tin thap hon do chinh xac.
- Tung co mot loi sai truoc day.
- Concept moi hoc can kiem tra lai.

### Rule phien choi

- Mac dinh thoi luong: 5 phut.
- Mac dinh so cau: 4 cau.
- Moi cau bat buoc chon confidence.
- Ket qua ghi nhan ca accuracy va confidence calibration.

### Ket qua

- Neu tra loi dung va tu tin phu hop: tang delayed-recall evidence.
- Neu tra loi sai: tao recovery queue.
- Neu tu tin cao nhung sai: uu tien dua vao Error Dungeon.
- Neu tu tin thap nhung dung: mastery tang cham hon va lich on gan hon.

### Vi du

Question: Mo hinh gradient descent dao dong vi hai feature co mien gia tri khac nhau. Cach nao xu ly dung nguyen nhan nhat?

Correct answer: scale input features to comparable ranges.

Result example:

- `3 / 4 correct`
- `1 recovery queued`
- Feature Scaling: on lai sau 3 ngay
- MSE Loss: on lai ngay mai

## 3. Error Dungeon

### Muc tieu

Error Dungeon bien loi sai cu thanh nhiem vu co the chinh phuc. Mode nay giup nguoi choi khong bo qua misconception sau khi xem dap an.

### Core Loop

1. He thong lay cac loi sai trong lich su.
2. Moi loi sai tro thanh mot recovery mission.
3. Nguoi choi xem lai source.
4. Nguoi choi giai thich lai loi sai bang loi cua minh.
5. Nguoi choi giai mot cau tuong tu.
6. Nguoi choi van dung sang mot context moi.
7. Neu qua het, misconception duoc danh dau resolved.

### Recovery Steps

Frontend dang co 5 buoc:

1. `Review`: xem lai source evidence.
2. `Explain`: giai thich vi sao cach nghi cu sai.
3. `Similar`: lam mot cau tuong tu.
4. `Transfer`: van dung vao boi canh moi.
5. `Confirm`: xac nhan da sua misconception.

### Rule hoan thanh

- Khong duoc hoan thanh chi bang viec doc dap an.
- Phai co explanation va transfer evidence.
- Sau khi hoan thanh, nhan recovery bonus va len lich recall sau 3 ngay.

## 4. Lab Arena

### Muc tieu

Lab Arena kiem tra kha nang ap dung khai niem vao code. Mode nay danh cho cac concept can chung minh bang thuc hanh, vi du preprocessing, feature scaling, train/test split.

### Core Loop

1. Nguoi choi nhan mo ta lab.
2. Nguoi choi hoan thien ham code ngan.
3. Chay visible tests.
4. Neu test pass, submit lab.
5. He thong ghi nhan application evidence.
6. Nguoi choi duoc goi y dung concept nay trong Boss Battle.

### Rule code

- Code challenge phai nho va dung mot concept chinh.
- Co visible tests de nguoi choi tu kiem tra.
- Co hidden tests de tranh hard-code.
- Can lien ket ket qua code voi lecture concept.

### Vi du trong frontend

Task: hoan thien `standardize(X)` de moi feature co mean gan 0 va standard deviation gan 1.

Visible tests:

- mean is near zero
- std is near one
- shape is preserved

Completion:

- Run tests pass: tien do lab len 100%.
- Submit lab: nhan `+100 XP`, `Code application`, `Lab evidence`.

## 5. Boss Battle

### Muc tieu

Boss Battle la bai tong hop cuoi khu vuc. Nguoi choi phai chung minh rang minh co the ket hop nhieu concept trong mot scenario lon.

### Core Loop

1. Game mo mot scenario phuc hop.
2. Nguoi choi di qua nhieu phase.
3. Moi phase thu thap mot loai evidence.
4. Khi du evidence, nguoi choi danh bai boss.
5. Boss defeated se mo zone tiep theo.

### Phase trong frontend

Boss hien tai co 5 phase:

1. Diagnose root cause.
2. Choose pipeline fix.
3. Explain interaction.
4. Transfer to new data.
5. Final challenge.

### Rule thang

- Phai qua du 5 phase.
- Phai chung minh duoc nhieu concept: Feature Scaling, Learning Rate, MSE Loss, Train/Test Split.
- Cau tra loi giai thich phai noi duoc quan he giua cac loi, khong chi neu ten loi.
- Khi thang: nhan `+250 XP`, `Boss badge`, `Next zone unlocked`.

## 6. Live Class Battle

### Muc tieu

Live Class Battle la che do thi dau truc tiep theo lop. Ca lop cung giai mot shared boss challenge, giao vien co the xem phan bo dap an va misconception chung.

### Core Loop

1. Nguoi choi vao room bang class code.
2. Lop duoc chia team, vi du `Team Gradient`.
3. Moi team chon dap an va viet reasoning.
4. He thong tinh diem theo correctness, explanation quality va confidence match.
5. Giao vien reveal dap an va misconception pho bien.
6. Nguoi choi sai duoc de xuat personal recovery.

### Rule tinh diem

- Correctness: chon chan doan dung.
- Explanation quality: lap luan ro, gan voi concept.
- Confidence match: tu tin phu hop voi do dung.
- Team contribution: ca nhan dong gop vao dap an chung.

### Instructor View

Giao vien thay:

- So hoc vien da tham gia.
- Phase hien tai.
- So phan hoi da nop.
- Phan bo dap an.
- Top misconception cua lop.
- Nut reveal hint, lock answers, show explanation.

## Hieu That AI Checkpoint

### Muc tieu

`Hieu That` la mode MVP trung tam. Nguoi choi tra loi teach-back 1 cau, AI cham xem nguoi choi co that su hieu concept theo nguon khoa hoc hay khong.

### Core Loop

1. Hien mission va source truth.
2. Nguoi choi viet cau teach-back.
3. Nguoi choi chon do tu tin tu 1 den 5.
4. AI doi chieu cau tra loi voi source.
5. Ket qua thuoc mot trong 5 status.
6. Nguoi choi sua lai hoac sang mission tiep theo.

### Status Rules

- `mastered`: cau tra loi du y cot loi, dung bang loi cua nguoi choi, khong mau thuan source.
- `partial`: co y dung nhung thieu y quan trong hoac dien dat chua du ro.
- `misconception`: co claim trai voi source hoac dung misconception da biet.
- `needs_clarification`: cau tra loi qua mo ho, qua ngan hoac khong du thong tin de cham.
- `out_of_scope`: khong tra loi nhiem vu, prompt injection, xin secret, xin dap an hoac yeu cau ngoai scope.

### Rule an toan AI

- AI chi dung source evidence dang hien.
- AI khong tiet lo system prompt, API key, dap an ly tuong hoac noi dung ngoai mission.
- Prompt injection bi cham `out_of_scope`.
- Evidence IDs phai nam trong source cua mission.

## Reward va Progression

### XP

- Story Quest: khoang `80 XP`.
- Lab Arena: khoang `100 XP`.
- Boss Battle: khoang `250 XP`.
- Daily Recall: XP nho, vi du `35 XP`.
- Recovery bonus: them XP khi sua loi cu.

### Mastery

Mastery cua mot concept tang khi co nhieu loai evidence:

- quiz correctness
- delayed recall
- explanation
- misconception repair
- transfer challenge
- code application
- source-grounded explanation

### Unlock Rules

- Hoan thanh Story Quest de mo node tiep theo.
- Sua misconception de mo recovery bonus.
- Co application evidence de mo Boss Battle.
- Thang Boss Battle de mo zone tiep theo.
- Daily Recall khong mo khoa noi dung moi, nhung giu mastery khong bi giam.

## Ban rut gon de dua vao slide

VinCourse co 6 che do choi: Story Quest, Daily Recall, Error Dungeon, Lab Arena, Boss Battle va Live Class Battle. Moi che do tao mot loai minh chung hoc tap khac nhau: tra loi dung, nho lai sau thoi gian, sua hieu lam, van dung code, tong hop nhieu concept va hop tac theo lop. Game khong cham theo diem quiz don thuan; he thong chi cong nhan mastery khi nguoi hoc co evidence rang minh hieu, sua duoc loi sai va van dung duoc kien thuc vao tinh huong moi.
