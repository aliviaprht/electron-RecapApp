CREATE TABLE "order" (
	 "id_order"  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	 "kode_artikel" TEXT NOT NULL UNIQUE,
	 "nama_artikel" TEXT NOT NULL,
     "no_lko" TEXT NOT NULL UNIQUE,
     "id_konsumen" TEXT NOT NULL,
     "jumlah" INTEGER NOT NULL DEFAULT 0,
     "proses" INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE "produk" (
	 "id_produk" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
     "id_order" INTEGER NOT NULL,
     "jenis_product" TEXT NOT NULL,
     "jenis_bahan" TEXT NOT NULL,
     "jenis_sablon" TEXT
);
CREATE TABLE "produk_detail" (
	 "id_produk_detail" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
     "id_produk" INTEGER NOT NULL,
     "warna_bahan" TEXT NOT NULL,
     "jenis_bahan" TEXT NOT NULL
);
CREATE TABLE "letak_sablon" (
     "id_letak_sablon" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
     "id_produk" INTEGER NOT NULL,
     "letak_sablon" TEXT NOT NULL
);
CREATE TABLE "warna" (
     "id_warna" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
     "id_produk" INTEGER NOT NULL,
     "warna_bahan" TEXT NOT NULL
);
CREATE TABLE "pengiriman" (
     "id_pengiriman" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	 "id_order" INTEGER NOT NULL,
     "urutan" INTEGER NOT NULL,
     "status_pengiriman" INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE "jumlah_pengiriman" (
     "id_jumlah_pengiriman" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
     "id_pengiriman" INTEGER NOT NULL,
     "size_2" INTEGER NOT NULL DEFAULT 0,
     "size_4" INTEGER NOT NULL DEFAULT 0,
     "size_6" INTEGER NOT NULL DEFAULT 0,
     "size_8" INTEGER NOT NULL DEFAULT 0,
     "size_10" INTEGER NOT NULL DEFAULT 0,
     "size_12" INTEGER NOT NULL DEFAULT 0,
     "size_XS" INTEGER NOT NULL DEFAULT 0,
     "size_S" INTEGER NOT NULL DEFAULT 0,
     "size_M" INTEGER NOT NULL DEFAULT 0,
     "size_L" INTEGER NOT NULL DEFAULT 0,
     "size_XL" INTEGER NOT NULL DEFAULT 0,
     "size_3L" INTEGER NOT NULL DEFAULT 0,
     "size_4L" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "tanggal_proses" (
     "id_proses" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
     "id_order" INTEGER NOT NULL,
     "LKO" DATE,
     "TUNGGU_KAIN" DATE,
     "POTONG" DATE,
     "FILM" DATE,
     "SABLON" DATE,
     "JAHIT" DATE,
     "PACKING" DATE,
     "BELUM_KIRIM" DATE,
     "SUDAH_KIRIM" DATE
);
CREATE TABLE "konsumen" (
     "id_konsumen" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
     "nama_konsumen" TEXT NOT NULL,
     "warna" TEXT NOT NULL
);