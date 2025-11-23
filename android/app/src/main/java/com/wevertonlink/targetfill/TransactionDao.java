package com.wevertonlink.targetfill;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import java.util.List;

@Dao
public interface TransactionDao {
    @Insert
    void insert(Transaction transaction);

    @Query("SELECT * FROM transactions WHERE processed = 0 ORDER BY timestamp ASC")
    List<Transaction> getUnprocessedTransactions();

    @Query("UPDATE transactions SET processed = 1 WHERE id IN (:ids)")
    void markAsProcessed(int[] ids);

    @Query("DELETE FROM transactions WHERE processed = 1 AND timestamp < :cutoffTimestamp")
    void deleteOldProcessed(long cutoffTimestamp);

    @Query("SELECT COUNT(*) FROM transactions WHERE processed = 0")
    int getUnprocessedCount();
}
