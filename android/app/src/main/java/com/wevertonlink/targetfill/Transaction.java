package com.wevertonlink.targetfill;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "transactions")
public class Transaction {
    @PrimaryKey(autoGenerate = true)
    public int id;

    public double amount;
    public String type;        // CREDIT, DEBIT, SAVINGS, INVESTMENT, OTHER
    public String category;
    public String source;      // Nome do banco
    public String description;
    public String rawText;
    public long timestamp;
    public boolean processed;  // Flag para saber se já foi enviado ao app

    public Transaction(double amount, String type, String category, String source,
                      String description, String rawText, long timestamp) {
        this.amount = amount;
        this.type = type;
        this.category = category;
        this.source = source;
        this.description = description;
        this.rawText = rawText;
        this.timestamp = timestamp;
        this.processed = false;
    }
}
